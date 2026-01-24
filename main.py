from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from dataclasses import dataclass
from enum import Enum, auto
import numpy as np
import random
import logging
from datetime import datetime, timedelta

class RouteObjective(Enum):
    TIME = auto()
    COST = auto()
    SAFETY = auto()

@dataclass
class Waypoint:
    name: str
    latitude: float
    longitude: float
    weather_risk: float = 0.0
    piracy_risk: float = 0.0
    maritime_traffic: float = 0.0

@dataclass
class ShipParameters:
    ship_type: str
    fuel_efficiency: float
    max_speed: float
    cargo_capacity: float

class MaritimeRouteOptimizer:
    def __init__(self, population_size: int = 100, max_generations: int = 50, mutation_rate: float = 0.1):
        self.population_size = population_size
        self.max_generations = max_generations
        self.base_mutation_rate = mutation_rate
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        self.objectives = {RouteObjective.TIME.value: 0.4, RouteObjective.COST.value: 0.3, RouteObjective.SAFETY.value: 0.3}
        self.ports = [
            Waypoint("Chennai", 13.0827, 80.2707),
            Waypoint("Mumbai", 19.0760, 72.8777),
            Waypoint("Colombo", 6.9271, 79.8612),
            Waypoint("Kochi", 9.9312, 76.2673),
            Waypoint("Male", 4.1755, 73.5093),
            Waypoint("Durban", -29.8587, 31.0218),
            Waypoint("Muscat", 23.5880, 58.3829),
            Waypoint("Mombasa", -4.0435, 39.6682),
            Waypoint("Port Louis", -20.1619, 57.4989),
            Waypoint("Jakarta", -6.2088, 106.8456)
        ]
    
    def generate_initial_population(self, start: Waypoint, end: Waypoint, num_waypoints: int = 10) -> List[List[Waypoint]]:
        population = []
        for _ in range(self.population_size):
            route = [start]
            available_ports = [p for p in self.ports if p.name != start.name and p.name != end.name]
            for _ in range(min(num_waypoints - 2, len(available_ports))):
                if not available_ports:
                    break
                waypoint_idx = random.randint(0, len(available_ports) - 1)
                waypoint = available_ports.pop(waypoint_idx)
                # Create a new instance to avoid modifying the original
                new_waypoint = Waypoint(
                    waypoint.name,
                    waypoint.latitude,
                    waypoint.longitude,
                    random.uniform(0, 1),
                    random.uniform(0, 1),
                    random.uniform(0, 1)
                )
                route.append(new_waypoint)
            route.append(end)
            population.append(route)
        return population
    
    def calculate_route_fitness(self, route: List[Waypoint], ship: ShipParameters) -> Dict[int, float]:
        def haversine_distance(wp1: Waypoint, wp2: Waypoint) -> float:
            R = 6371
            lat1, lon1 = np.radians(wp1.latitude), np.radians(wp1.longitude)
            lat2, lon2 = np.radians(wp2.latitude), np.radians(wp2.longitude)
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
            c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
            return R * c
        
        total_distance = sum(haversine_distance(route[i], route[i+1]) for i in range(len(route)-1))
        time_cost = total_distance / ship.max_speed
        fuel_cost = total_distance * (1 / ship.fuel_efficiency)
        maintenance_cost = total_distance * 0.1
        safety_risks = [wp.weather_risk * 0.4 + wp.piracy_risk * 0.4 + wp.maritime_traffic * 0.2 for wp in route]
        safety_cost = float(np.mean(safety_risks))
        
        return {
            RouteObjective.TIME.value: float(time_cost),
            RouteObjective.COST.value: float(fuel_cost + maintenance_cost),
            RouteObjective.SAFETY.value: safety_cost
        }
    
    def optimize_route(
        self,
        start: Waypoint,
        end: Waypoint,
        ship: ShipParameters
    ) -> tuple:
        population = self.generate_initial_population(start, end)
        generation_data = []
        
        for generation in range(self.max_generations):
            fitness_scores = [self.calculate_route_fitness(route, ship) for route in population]
            
            best_fitness = min([sum(self.objectives[obj] * score for obj, score in scores.items()) for scores in fitness_scores])
            avg_fitness = float(np.mean([sum(self.objectives[obj] * score for obj, score in scores.items()) for scores in fitness_scores]))
            
            generation_data.append({
                'generation': generation + 1,
                'best_fitness': float(best_fitness),
                'avg_fitness': avg_fitness
            })
            
            ranked_population = sorted(
                zip(population, fitness_scores),
                key=lambda x: sum(self.objectives[obj] * score for obj, score in x[1].items())
            )
            selected_population = [route for route, _ in ranked_population[:self.population_size//2]]
            
            new_population = []
            while len(new_population) < self.population_size:
                parent1 = random.choice(selected_population)
                parent2 = random.choice(selected_population)
                crossover_point = len(parent1) // 2
                child = parent1[:crossover_point] + parent2[crossover_point:]
                new_population.append(child)
            
            population = new_population
        
        best_route = min(
            population,
            key=lambda route: sum(self.objectives[obj] * score for obj, score in self.calculate_route_fitness(route, ship).items())
        )
        return best_route, generation_data

# Utility functions

def haversine_distance(wp1: Waypoint, wp2: Waypoint) -> float:
    R = 6371
    lat1, lon1 = np.radians(wp1.latitude), np.radians(wp1.longitude)
    lat2, lon2 = np.radians(wp2.latitude), np.radians(wp2.longitude)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
    return float(R * c)

def generate_risk_analysis(route: List[Waypoint]) -> List[Dict[str, float]]:
    risk_data = []
    for i, wp in enumerate(route):
        risk_data.append({
            "Waypoint": wp.name,
            "Weather Risk": wp.weather_risk,
            "Piracy Risk": wp.piracy_risk,
            "Maritime Traffic": wp.maritime_traffic,
            "Total Risk": wp.weather_risk * 0.4 + wp.piracy_risk * 0.4 + wp.maritime_traffic * 0.2,
            "Order": i
        })
    return risk_data

def create_weather_forecast(route: List[Waypoint]) -> List[List[float]]:
    weather_data = []
    for wp in route:
        for _ in range(5):
            lat_offset = random.uniform(-2, 2)
            lon_offset = random.uniform(-2, 2)
            intensity = wp.weather_risk * random.uniform(0.8, 1.2)
            weather_data.append([wp.latitude + lat_offset, wp.longitude + lon_offset, float(intensity)])
    return weather_data

def create_piracy_hotspots(route: List[Waypoint]) -> List[Dict[str, any]]:
    piracy_data = []
    for wp in route:
        if wp.piracy_risk > 0.3:
            piracy_data.append({
                'location': [wp.latitude, wp.longitude],
                'intensity': float(wp.piracy_risk)
            })
    return piracy_data

def simulate_alternative_routes(
    optimizer: MaritimeRouteOptimizer,
    start: Waypoint,
    end: Waypoint,
    ship_params: ShipParameters,
    num_simulations: int = 5
):
    routes = []
    for _ in range(num_simulations):
        optimizer.objectives = {
            RouteObjective.TIME.value: random.uniform(0.2, 0.6),
            RouteObjective.COST.value: random.uniform(0.2, 0.5),
            RouteObjective.SAFETY.value: random.uniform(0.2, 0.5)
        }
        total = sum(optimizer.objectives.values())
        for key in optimizer.objectives:
            optimizer.objectives[key] /= total
        
        route, _ = optimizer.optimize_route(start, end, ship_params)
        fitness = optimizer.calculate_route_fitness(route, ship_params)
        total_distance = sum(haversine_distance(route[i], route[i+1]) for i in range(len(route)-1))
        
        routes.append({
            "route": route,
            "time_priority": optimizer.objectives[RouteObjective.TIME.value],
            "cost_priority": optimizer.objectives[RouteObjective.COST.value],
            "safety_priority": optimizer.objectives[RouteObjective.SAFETY.value],
            "distance": total_distance,
            "time": fitness[RouteObjective.TIME.value],
            "cost": fitness[RouteObjective.COST.value],
            "safety_risk": fitness[RouteObjective.SAFETY.value],
            "waypoints": len(route)
        })
    return routes

def format_time(hours: Optional[float]) -> str:
    if hours is None:
        return "N/A"
    try:
        hours_float = float(hours)
        days = int(hours_float // 24)
        remaining_hours = int(hours_float % 24)
        if days > 0:
            return f"{days}d {remaining_hours}h"
        else:
            return f"{remaining_hours}h"
    except (TypeError, ValueError):
        return "Error"

# Pydantic models

class WaypointModel(BaseModel):
    name: str
    latitude: float
    longitude: float
    weather_risk: float = 0.0
    piracy_risk: float = 0.0
    maritime_traffic: float = 0.0

class ShipParametersModel(BaseModel):
    ship_type: str
    fuel_efficiency: float
    max_speed: float
    cargo_capacity: float

class OptimizeRequest(BaseModel):
    start_port: str
    end_port: str
    ship_type: Optional[str] = None
    ship_params: Optional[ShipParametersModel] = None
    population_size: int = Field(default=100, ge=10)
    max_generations: int = Field(default=50, ge=1)
    mutation_rate: float = Field(default=0.1, gt=0)
    objectives: Optional[Dict[str, float]] = None
    num_waypoints: int = Field(default=10, ge=2)

class OptimizeResponse(BaseModel):
    optimized_route: List[WaypointModel]
    generation_data: List[Dict[str, float]]
    fitness: Dict[str, float]
    total_distance: float
    weather_data: List[List[float]]
    piracy_data: List[Dict]
    alternative_routes: List[Dict[str, float]]

class RiskAnalysisRequest(BaseModel):
    route: List[WaypointModel]

class RiskAnalysisResponse(BaseModel):
    risk_data: List[Dict]

class SimulationRequest(BaseModel):
    route: List[WaypointModel]
    ship_params: ShipParametersModel
    weather_factor: float = 0.3
    piracy_factor: float = 0.3
    fuel_cost_multiplier: float = 1.0

class SimulationResponse(BaseModel):
    comparison_data: List[Dict]
    updated_weather: List[List[float]]
    updated_piracy: List[Dict]

class ETARequest(BaseModel):
    departure_datetime: datetime
    travel_hours: float

class ETAResponse(BaseModel):
    eta: datetime

# FastAPI app

app = FastAPI(title="Maritime Route Optimizer API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

optimizer_singleton = MaritimeRouteOptimizer()

# Helper converters

def to_waypoint_model(wp: Waypoint) -> WaypointModel:
    return WaypointModel(
        name=wp.name,
        latitude=wp.latitude,
        longitude=wp.longitude,
        weather_risk=wp.weather_risk,
        piracy_risk=wp.piracy_risk,
        maritime_traffic=wp.maritime_traffic
    )

def to_ship_params_model(sp: ShipParameters) -> ShipParametersModel:
    return ShipParametersModel(
        ship_type=sp.ship_type,
        fuel_efficiency=sp.fuel_efficiency,
        max_speed=sp.max_speed,
        cargo_capacity=sp.cargo_capacity
    )

@app.get("/ports", response_model=List[WaypointModel])
def get_ports():
    return [to_waypoint_model(p) for p in optimizer_singleton.ports]

@app.get("/ship-types")
def get_ship_types():
    return {
        "Cargo": to_ship_params_model(ShipParameters("Cargo", 0.8, 20.0, 5000.0)).dict(),
        "Container": to_ship_params_model(ShipParameters("Container", 0.7, 18.0, 8000.0)).dict(),
        "Tanker": to_ship_params_model(ShipParameters("Tanker", 0.6, 15.0, 10000.0)).dict(),
        "Passenger": to_ship_params_model(ShipParameters("Passenger", 0.5, 22.0, 2000.0)).dict(),
    }

@app.post("/optimize", response_model=OptimizeResponse)
def optimize(req: OptimizeRequest):
    opt = MaritimeRouteOptimizer(req.population_size, req.max_generations, req.mutation_rate)
    
    if req.objectives:
        # Map string keys to enum values
        objective_mapping = {
            'time': RouteObjective.TIME.value,
            'cost': RouteObjective.COST.value,
            'safety': RouteObjective.SAFETY.value,
            'distance': RouteObjective.TIME.value,  # Map distance to time
            'fuel_cost': RouteObjective.COST.value,  # Map fuel_cost to cost
            'risk': RouteObjective.SAFETY.value  # Map risk to safety
        }
        
        mapped_objectives = {}
        for key, value in req.objectives.items():
            enum_key = objective_mapping.get(key.lower(), RouteObjective.TIME.value)
            if enum_key in mapped_objectives:
                mapped_objectives[enum_key] += value
            else:
                mapped_objectives[enum_key] = value
        
        total = sum(mapped_objectives.values())
        opt.objectives = {k: v/total for k, v in mapped_objectives.items()}
    
    start_wp = next((p for p in opt.ports if p.name == req.start_port), None)
    end_wp = next((p for p in opt.ports if p.name == req.end_port), None)
    
    if not start_wp or not end_wp:
        raise ValueError("Invalid start or end port")
    
    if req.ship_params:
        ship = ShipParameters(
            req.ship_params.ship_type,
            req.ship_params.fuel_efficiency,
            req.ship_params.max_speed,
            req.ship_params.cargo_capacity
        )
    else:
        default = {
            "Cargo": ShipParameters("Cargo", 0.8, 20.0, 5000.0),
            "Container": ShipParameters("Container", 0.7, 18.0, 8000.0),
            "Tanker": ShipParameters("Tanker", 0.6, 15.0, 10000.0),
            "Passenger": ShipParameters("Passenger", 0.5, 22.0, 2000.0)
        }
        ship = default.get(req.ship_type or "Cargo", default["Cargo"])
    
    optimized_route, generation_data = opt.optimize_route(start_wp, end_wp, ship)
    fitness = opt.calculate_route_fitness(optimized_route, ship)
    total_distance = sum(haversine_distance(optimized_route[i], optimized_route[i+1]) for i in range(len(optimized_route)-1))
    weather_data = create_weather_forecast(optimized_route)
    piracy_data = create_piracy_hotspots(optimized_route)
    alt_routes = simulate_alternative_routes(opt, start_wp, end_wp, ship)
    
    alt_summary = [{
        "time_priority": r["time_priority"],
        "cost_priority": r["cost_priority"],
        "safety_priority": r["safety_priority"],
        "distance": r["distance"],
        "time": r["time"],
        "cost": r["cost"],
        "safety_risk": r["safety_risk"],
        "waypoints": r["waypoints"]
    } for r in alt_routes]
    
    return OptimizeResponse(
        optimized_route=[to_waypoint_model(wp) for wp in optimized_route],
        generation_data=generation_data,
        fitness={
            "time": fitness[RouteObjective.TIME.value],
            "cost": fitness[RouteObjective.COST.value],
            "safety": fitness[RouteObjective.SAFETY.value]
        },
        total_distance=total_distance,
        weather_data=weather_data,
        piracy_data=piracy_data,
        alternative_routes=alt_summary
    )

@app.post("/risk-analysis", response_model=RiskAnalysisResponse)
def risk_analysis(req: RiskAnalysisRequest):
    route_objs = [
        Waypoint(
            w.name,
            w.latitude,
            w.longitude,
            w.weather_risk,
            w.piracy_risk,
            w.maritime_traffic
        ) for w in req.route
    ]
    return RiskAnalysisResponse(risk_data=generate_risk_analysis(route_objs))

@app.post("/simulate", response_model=SimulationResponse)
def simulate(req: SimulationRequest):
    route_objs = [
        Waypoint(
            w.name,
            w.latitude,
            w.longitude,
            w.weather_risk,
            w.piracy_risk,
            w.maritime_traffic
        ) for w in req.route
    ]
    ship = ShipParameters(
        req.ship_params.ship_type,
        req.ship_params.fuel_efficiency,
        req.ship_params.max_speed,
        req.ship_params.cargo_capacity
    )
    
    opt = optimizer_singleton
    orig_fitness = opt.calculate_route_fitness(route_objs, ship)
    
    simulated_route = [
        Waypoint(
            wp.name,
            wp.latitude,
            wp.longitude,
            wp.weather_risk,
            wp.piracy_risk,
            wp.maritime_traffic
        ) for wp in route_objs
    ]
    
    for wp in simulated_route:
        wp.weather_risk = min(1.0, wp.weather_risk * req.weather_factor * 1.5)
        wp.piracy_risk = min(1.0, wp.piracy_risk * req.piracy_factor * 1.5)
    
    adjusted_fitness = opt.calculate_route_fitness(simulated_route, ship)
    adjusted_fitness[RouteObjective.COST.value] *= req.fuel_cost_multiplier
    
    comparison_data = [
        {
            "Metric": "Time (hours)",
            "Original": orig_fitness[RouteObjective.TIME.value],
            "Simulated": adjusted_fitness[RouteObjective.TIME.value],
            "Change (%)": ((adjusted_fitness[RouteObjective.TIME.value] - orig_fitness[RouteObjective.TIME.value]) / orig_fitness[RouteObjective.TIME.value] * 100) if orig_fitness[RouteObjective.TIME.value] else 0.0
        },
        {
            "Metric": "Cost ($)",
            "Original": orig_fitness[RouteObjective.COST.value],
            "Simulated": adjusted_fitness[RouteObjective.COST.value],
            "Change (%)": ((adjusted_fitness[RouteObjective.COST.value] - orig_fitness[RouteObjective.COST.value]) / orig_fitness[RouteObjective.COST.value] * 100) if orig_fitness[RouteObjective.COST.value] else 0.0
        },
        {
            "Metric": "Safety Risk",
            "Original": orig_fitness[RouteObjective.SAFETY.value],
            "Simulated": adjusted_fitness[RouteObjective.SAFETY.value],
            "Change (%)": ((adjusted_fitness[RouteObjective.SAFETY.value] - orig_fitness[RouteObjective.SAFETY.value]) / orig_fitness[RouteObjective.SAFETY.value] * 100) if orig_fitness[RouteObjective.SAFETY.value] else 0.0
        },
    ]
    
    updated_weather = create_weather_forecast(simulated_route)
    updated_piracy = create_piracy_hotspots(simulated_route)
    
    return SimulationResponse(
        comparison_data=comparison_data,
        updated_weather=updated_weather,
        updated_piracy=updated_piracy
    )

@app.post("/eta", response_model=ETAResponse)
def eta(req: ETARequest):
    eta_val = req.departure_datetime + timedelta(hours=float(req.travel_hours))
    return ETAResponse(eta=eta_val)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ship-routing-api"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)