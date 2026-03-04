import asyncio
import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

app = Server("pilates-booking-api")
API_BASE_URL = "https://glorious-halibut-jj5v9v9jrx6wfqxrg-8000.app.github.dev"


@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_all_bookings",
            description="Retrieve all Pilates class bookings from the database. Shows client names, class details, booking status (confirmed/waitlist/cancelled), and booking dates.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        
        types.Tool(
            name="get_booking_details",
            description="Get detailed information about a specific booking by ID.",
            inputSchema={
                "type": "object",
                "properties": {
                    "booking_id": {
                        "type": "integer",
                        "description": "The ID of the booking to retrieve"
                    }
                },
                "required": ["booking_id"]
            }
        ),
        
        types.Tool(
            name="create_booking",
            description="Create a new booking for a client in a Pilates class. Automatically checks if the class is full and assigns waitlist status if needed.",
            inputSchema={
                "type": "object",
                "properties": {
                    "client_id": {
                        "type": "integer",
                        "description": "The ID number of the client making the booking"
                    },
                    "class_id": {
                        "type": "integer",
                        "description": "The ID number of the Pilates class to book"
                    },
                    "status": {
                        "type": "string",
                        "description": "Booking status: 'confirmed', 'waitlist', or 'cancelled'",
                        "enum": ["confirmed", "waitlist", "cancelled"],
                        "default": "confirmed"
                    }
                },
                "required": ["client_id", "class_id"]
            }
        ),
        
        types.Tool(
            name="update_booking",
            description="Update an existing booking's status or details.",
            inputSchema={
                "type": "object",
                "properties": {
                    "booking_id": {
                        "type": "integer",
                        "description": "ID of the booking to update"
                    },
                    "client_id": {
                        "type": "integer",
                        "description": "Updated client ID"
                    },
                    "class_id": {
                        "type": "integer",
                        "description": "Updated class ID"
                    },
                    "status": {
                        "type": "string",
                        "description": "Updated status",
                        "enum": ["confirmed", "waitlist", "cancelled"]
                    }
                },
                "required": ["booking_id", "client_id", "class_id", "status"]
            }
        ),
        
        types.Tool(
            name="delete_booking",
            description="Delete a booking from the system.",
            inputSchema={
                "type": "object",
                "properties": {
                    "booking_id": {
                        "type": "integer",
                        "description": "ID of the booking to delete"
                    }
                },
                "required": ["booking_id"]
            }
        ),
        
        types.Tool(
            name="get_all_classes",
            description="Retrieve all available Pilates classes. Shows class name, level (Beginner/Intermediate/Advanced), instructor, day of week, time, duration, and capacity.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        
        types.Tool(
            name="check_class_availability",
            description="Check how many spots are available in a specific Pilates class. Shows total capacity, confirmed bookings, and remaining spots.",
            inputSchema={
                "type": "object",
                "properties": {
                    "class_id": {
                        "type": "integer",
                        "description": "The ID number of the class to check"
                    }
                },
                "required": ["class_id"]
            }
        ),
        
        types.Tool(
            name="get_all_clients",
            description="Retrieve all registered clients. Shows names, emails, phone numbers, age, package type, and join date.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        
        types.Tool(
            name="get_client_details",
            description="Get detailed information about a specific client by ID.",
            inputSchema={
                "type": "object",
                "properties": {
                    "client_id": {
                        "type": "integer",
                        "description": "The ID of the client to retrieve"
                    }
                },
                "required": ["client_id"]
            }
        ),
        
        types.Tool(
            name="create_client",
            description="Register a new client in the Pilates booking system. Creates a client account with their personal details and package type.",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Client's full name"
                    },
                    "email": {
                        "type": "string",
                        "description": "Client's email address (must be unique)"
                    },
                    "phone": {
                        "type": "string",
                        "description": "Client's phone number (optional)"
                    },
                    "age": {
                        "type": "integer",
                        "description": "Client's age (optional)"
                    },
                    "package_type": {
                        "type": "string",
                        "description": "Package type: '10-class', 'monthly', or 'drop-in'",
                        "enum": ["10-class", "monthly", "drop-in"]
                    }
                },
                "required": ["name", "email"]
            }
        ),
        
        types.Tool(
            name="update_client",
            description="Update an existing client's information. Can modify name, email, phone, age, or package type.",
            inputSchema={
                "type": "object",
                "properties": {
                    "client_id": {
                        "type": "integer",
                        "description": "ID of the client to update"
                    },
                    "name": {
                        "type": "string",
                        "description": "Updated full name"
                    },
                    "email": {
                        "type": "string",
                        "description": "Updated email address"
                    },
                    "phone": {
                        "type": "string",
                        "description": "Updated phone number"
                    },
                    "age": {
                        "type": "integer",
                        "description": "Updated age"
                    },
                    "package_type": {
                        "type": "string",
                        "description": "Updated package type",
                        "enum": ["10-class", "monthly", "drop-in"]
                    }
                },
                "required": ["client_id", "name", "email"]
            }
        ),
        
        types.Tool(
            name="delete_client",
            description="Delete a client from the system. WARNING: This also deletes all their bookings due to database relationships.",
            inputSchema={
                "type": "object",
                "properties": {
                    "client_id": {
                        "type": "integer",
                        "description": "ID of the client to delete"
                    }
                },
                "required": ["client_id"]
            }
        ),
        
        types.Tool(
            name="get_all_studios",
            description="Retrieve all Leeds leisure centre locations where Pilates classes are held. Shows 17 real locations from Leeds City Council data.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        
        types.Tool(
            name="get_private_sessions",
            description="Retrieve all private session requests submitted by clients.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        
        types.Tool(
            name="get_private_session_details",
            description="Get detailed information about a specific private session request.",
            inputSchema={
                "type": "object",
                "properties": {
                    "session_id": {
                        "type": "integer",
                        "description": "The ID of the private session to retrieve"
                    }
                },
                "required": ["session_id"]
            }
        ),
        
        types.Tool(
            name="create_private_session",
            description="Create a new private session request with client details and preferences.",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Client's full name"
                    },
                    "email": {
                        "type": "string",
                        "description": "Client's email address"
                    },
                    "phone": {
                        "type": "string",
                        "description": "Client's phone number"
                    },
                    "preferred_date": {
                        "type": "string",
                        "description": "Preferred date for the session (YYYY-MM-DD)"
                    },
                    "preferred_time": {
                        "type": "string",
                        "description": "Preferred time slot: 'morning', 'afternoon', or 'evening'"
                    },
                    "experience": {
                        "type": "string",
                        "description": "Experience level: 'Beginner', 'Intermediate', or 'Advanced'"
                    },
                    "goals": {
                        "type": "string",
                        "description": "Client's goals and objectives"
                    },
                    "injuries": {
                        "type": "string",
                        "description": "Any injuries or health considerations"
                    }
                },
                "required": ["name", "email", "phone", "preferred_date", "preferred_time"]
            }
        ),
        
        types.Tool(
            name="update_private_session_status",
            description="Update the status of a private session request (pending, confirmed, cancelled).",
            inputSchema={
                "type": "object",
                "properties": {
                    "session_id": {
                        "type": "integer",
                        "description": "ID of the private session to update"
                    },
                    "status": {
                        "type": "string",
                        "description": "New status for the session",
                        "enum": ["pending", "confirmed", "cancelled"]
                    }
                },
                "required": ["session_id", "status"]
            }
        ),
        
        types.Tool(
            name="delete_private_session",
            description="Delete a private session request from the system.",
            inputSchema={
                "type": "object",
                "properties": {
                    "session_id": {
                        "type": "integer",
                        "description": "ID of the private session to delete"
                    }
                },
                "required": ["session_id"]
            }
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    async with httpx.AsyncClient() as client:
        try:
            if name == "get_all_bookings":
                response = await client.get(f"{API_BASE_URL}/api/bookings")
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Found {len(data)} bookings:\n{data}"
                )]
            
            elif name == "get_booking_details":
                booking_id = arguments.get("booking_id")
                response = await client.get(f"{API_BASE_URL}/api/bookings/{booking_id}")
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Booking Details:\n"
                         f"Booking ID: {data.get('id')}\n"
                         f"Client ID: {data.get('client_id')}\n"
                         f"Class ID: {data.get('class_id')}\n"
                         f"Status: {data.get('status')}\n"
                         f"Booking Date: {data.get('booking_date')}"
                )]
            
            elif name == "create_booking":
                response = await client.post(
                    f"{API_BASE_URL}/api/bookings",
                    json=arguments
                )
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Booking created successfully!\n"
                         f"Booking ID: {data.get('id')}\n"
                         f"Client ID: {data.get('client_id')}\n"
                         f"Class ID: {data.get('class_id')}\n"
                         f"Status: {data.get('status')}\n"
                         f"Booking Date: {data.get('booking_date')}"
                )]
            
            elif name == "update_booking":
                booking_id = arguments.pop("booking_id")
                response = await client.put(
                    f"{API_BASE_URL}/api/bookings/{booking_id}",
                    json=arguments
                )
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Booking updated successfully!\n"
                         f"Booking ID: {data.get('id')}\n"
                         f"Status: {data.get('status')}"
                )]
            
            elif name == "delete_booking":
                booking_id = arguments.get("booking_id")
                response = await client.delete(
                    f"{API_BASE_URL}/api/bookings/{booking_id}"
                )
                response.raise_for_status()
                
                return [types.TextContent(
                    type="text",
                    text=f"Booking {booking_id} deleted successfully!"
                )]
            
            elif name == "get_all_classes":
                response = await client.get(f"{API_BASE_URL}/api/classes")
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Found {len(data)} Pilates classes:\n{data}"
                )]
            
            elif name == "check_class_availability":
                class_id = arguments.get("class_id")
                response = await client.get(
                    f"{API_BASE_URL}/api/classes/{class_id}/availability"
                )
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Class Availability:\n"
                         f"Class: {data['class_name']}\n"
                         f"Capacity: {data['capacity']} total spots\n"
                         f"Booked: {data['booked']} confirmed bookings\n"
                         f"Available: {data['available_spots']} spots remaining\n"
                         f"Status: {'FULL' if data['is_full'] else 'OPEN'}"
                )]
            
            elif name == "get_all_clients":
                response = await client.get(f"{API_BASE_URL}/api/clients")
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Found {len(data)} registered clients:\n{data}"
                )]
            
            elif name == "get_client_details":
                client_id = arguments.get("client_id")
                response = await client.get(f"{API_BASE_URL}/api/clients/{client_id}")
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Client Details:\n"
                         f"Client ID: {data.get('id')}\n"
                         f"Name: {data.get('name')}\n"
                         f"Email: {data.get('email')}\n"
                         f"Phone: {data.get('phone', 'Not provided')}\n"
                         f"Age: {data.get('age', 'Not provided')}\n"
                         f"Package: {data.get('package_type', 'Not specified')}\n"
                         f"Join Date: {data.get('join_date')}"
                )]
            
            elif name == "create_client":
                response = await client.post(
                    f"{API_BASE_URL}/api/clients",
                    json=arguments
                )
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Client created successfully!\n"
                         f"Client ID: {data.get('id')}\n"
                         f"Name: {data.get('name')}\n"
                         f"Email: {data.get('email')}\n"
                         f"Phone: {data.get('phone', 'Not provided')}\n"
                         f"Age: {data.get('age', 'Not provided')}\n"
                         f"Package: {data.get('package_type', 'Not specified')}\n"
                         f"Join Date: {data.get('join_date')}"
                )]
            
            elif name == "update_client":
                client_id = arguments.pop("client_id")
                response = await client.put(
                    f"{API_BASE_URL}/api/clients/{client_id}",
                    json=arguments
                )
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Client updated successfully!\n"
                         f"Client ID: {data.get('id')}\n"
                         f"Name: {data.get('name')}\n"
                         f"Email: {data.get('email')}\n"
                         f"Phone: {data.get('phone', 'Not provided')}\n"
                         f"Age: {data.get('age', 'Not provided')}\n"
                         f"Package: {data.get('package_type', 'Not specified')}"
                )]
            
            elif name == "delete_client":
                client_id = arguments.get("client_id")
                response = await client.delete(
                    f"{API_BASE_URL}/api/clients/{client_id}"
                )
                response.raise_for_status()
                
                return [types.TextContent(
                    type="text",
                    text=f"Client {client_id} deleted successfully!\n"
                         f"Note: All bookings for this client were also deleted."
                )]
            
            elif name == "get_all_studios":
                response = await client.get(f"{API_BASE_URL}/api/studios")
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Found {len(data)} Leeds leisure centres:\n{data}"
                )]
            
            elif name == "get_private_sessions":
                response = await client.get(f"{API_BASE_URL}/api/private-sessions")
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Found {len(data)} private session requests:\n{data}"
                )]
            
            elif name == "get_private_session_details":
                session_id = arguments.get("session_id")
                response = await client.get(f"{API_BASE_URL}/api/private-sessions/{session_id}")
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Private Session Details:\n"
                         f"Request ID: {data.get('id')}\n"
                         f"Name: {data.get('name')}\n"
                         f"Email: {data.get('email')}\n"
                         f"Phone: {data.get('phone')}\n"
                         f"Preferred Date: {data.get('preferred_date')}\n"
                         f"Preferred Time: {data.get('preferred_time')}\n"
                         f"Experience: {data.get('experience', 'Not specified')}\n"
                         f"Goals: {data.get('goals', 'Not specified')}\n"
                         f"Status: {data.get('status')}\n"
                         f"Submitted: {data.get('created_at')}"
                )]
            
            elif name == "create_private_session":
                response = await client.post(
                    f"{API_BASE_URL}/api/private-sessions",
                    json=arguments
                )
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Private session request created!\n"
                         f"Request ID: {data.get('id')}\n"
                         f"Name: {data.get('name')}\n"
                         f"Preferred Date: {data.get('preferred_date')}\n"
                         f"Preferred Time: {data.get('preferred_time')}\n"
                         f"Status: {data.get('status')}"
                )]
            
            elif name == "update_private_session_status":
                session_id = arguments.get("session_id")
                status = arguments.get("status")
                response = await client.put(
                    f"{API_BASE_URL}/api/private-sessions/{session_id}",
                    params={"status_update": status}
                )
                response.raise_for_status()
                data = response.json()
                
                return [types.TextContent(
                    type="text",
                    text=f"Private session status updated!\n"
                         f"Request ID: {data.get('id')}\n"
                         f"New Status: {data.get('status')}"
                )]
            
            elif name == "delete_private_session":
                session_id = arguments.get("session_id")
                response = await client.delete(
                    f"{API_BASE_URL}/api/private-sessions/{session_id}"
                )
                response.raise_for_status()
                
                return [types.TextContent(
                    type="text",
                    text=f"Private session request {session_id} deleted successfully!"
                )]
            
            else:
                return [types.TextContent(
                    type="text",
                    text=f"Error: Unknown tool '{name}' requested"
                )]
        
        except httpx.HTTPError as e:
            return [types.TextContent(
                type="text",
                text=f"API Error: {str(e)}\n"
                     f"Make sure FastAPI server is running at {API_BASE_URL}"
            )]


async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())