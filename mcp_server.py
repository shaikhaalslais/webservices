"""
MCP Server for Pilates Booking API
Makes API accessible to Claude AI via Model Context Protocol

This demonstrates cutting-edge AI integration and positions
the API as not just a backend service, but an AI-accessible tool.
"""

import asyncio
import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

# Initialize MCP server
app = Server("pilates-booking-api")

# Your FastAPI base URL
API_BASE_URL = "http://localhost:8000"

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    # Define the tools (API endpoints) that Claude AI can use
    # Each tool maps to one of your FastAPI endpoints

    return [
        # Tool 1: Get All Bookings
        types.Tool(
            name="get_all_bookings",
            description="Retrieve all Pilates class bookings from the database. Returns booking details including client info, class info, and booking status.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),

        # Tool 2: Create a New Booking
        types.Tool(
            name="create_booking",
            description="Create a new Pilates class booking. Requires client_id and class_id. Returns the created booking with confirmation.",
            inputSchema={
                "type": "object",
                "properties": {
                    "client_id": {
                        "type": "integer",
                        "description": "ID of the client making the booking"
                    },
                    "class_id": {
                        "type": "integer",
                        "description": "ID of the Pilates class to book"
                    },
                    "status": {
                        "type": "string",
                        "description": "Booking status (confirmed/waitlist/cancelled)",
                        "enum": ["confirmed", "waitlist", "cancelled"],
                        "default": "confirmed"
                    }
                },
                "required": ["client_id", "class_id"]
            }
        ),

        # Tool 3: Get All Classes
        types.Tool(
            name="get_all_classes",
            description="Retrieve all available Pilates classes with details about instructor, time, level, and capacity.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),

        # Tool 4: Get All Clients
        types.Tool(
            name="get_all_clients",
            description="Retrieve all registered clients with their information and booking history.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),

        # Tool 5: Check Class Availability
        types.Tool(
            name="check_class_availability",
            description="Check how many spots are available in a specific Pilates class.",
            inputSchema={
                "type": "object",
                "properties": {
                    "class_id": {
                        "type": "integer",
                        "description": "ID of the class to check"
                    }
                },
                "required": ["class_id"]
            }
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    # Execute the requested tool by calling your FastAPI endpoints
    # This is where MCP bridges to your actual API
    
    # Create async HTTP client for making API requests
    async with httpx.AsyncClient() as client:
        try:
            # Handle each tool by calling the appropriate API endpoint

            if name == "get_all_bookings":
                # GET /api/bookings - Retrieve all bookings
                response = await client.get(f"{API_BASE_URL}/api/bookings")
                response.raise_for_status()
                data = response.json()
                return [types.TextContent(
                    type="text",
                    text=f"Found {len(data)} bookings:\n{data}"
                )]
            
            elif name == "create_booking":
                # POST /api/bookings - Create a new booking
                response = await client.post(
                    f"{API_BASE_URL}/api/bookings",
                    json=arguments
                )
                response.raise_for_status()
                data = response.json()
                return [types.TextContent(
                    type="text",
                    text=f" Booking created successfully! Details: {data}"
                )]
            
            elif name == "get_all_classes":
                # GET /api/classes - Retrieve all Pilates classes
                response = await client.get(f"{API_BASE_URL}/api/classes")
                response.raise_for_status()
                data = response.json()
                return [types.TextContent(
                    type="text",
                    text=f"Available classes: {data}"
                )]
            
            elif name == "get_all_clients":
                # GET /api/clients - Retrieve all clients
                response = await client.get(f"{API_BASE_URL}/api/clients")
                response.raise_for_status()
                data = response.json()
                return [types.TextContent(
                    type="text",
                    text=f"Registered clients: {data}"
                )]
            
            elif name == "check_class_availability":
                class_id = arguments.get("class_id")
                response = await client.get(f"{API_BASE_URL}/api/classes/{class_id}/availability")
                response.raise_for_status()
                data = response.json()
                return [types.TextContent(
                    type="text",
                    text=f"Class availability: {data['available_spots']} spots remaining out of {data['capacity']}"
                )]
             
            else:
                return [types.TextContent(
                    type="text",
                    text=f"❌ Unknown tool: {name}"
                )]
        
        except httpx.HTTPError as e:
            return [types.TextContent(
                type="text",
                text=f"❌ API Error: {str(e)}"
            )]


async def main():
    # run the mcp server
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())