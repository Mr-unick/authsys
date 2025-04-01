import { ResponseInstance } from "@/utils/instances";







export default async function handler(req, res) {
    const { user } = req.body;

    let data = {
        "message": "Request successful",
        "data": {
            "name": "Leads",
            "title": "Leads Details",
            "update": false,
            "delete": true,
            "view": true,
            "assign": true,
            "create": false,
            "createform": {
                "method": "post",
                "formurl": "leadform"
            },
            "updateform": {
                "method": "put",
                "formurl": "leadform"
            },
            "formtype": "modal",
            "rows": [
                {
                    "id": 1,
                    "name": "Nikhil Lende",
                    "email": "nikhillende@gmail.com",
                    "address": "Ghatanji",
                    "phone": "7448080267",
                    "second_phone": "9527116623",
                    "status": true,
                    "collborators": [],
                    "headcollborator": "Nikhil Lende",
                    "nextfollowup": "-",
                    "lead_source": "-",
                    "note": "-"
                },
                {
                    "id": 2,
                    "name": "Rahul Sharma",
                    "email": "rahul.sharma@example.com",
                    "address": "Mumbai",
                    "phone": "9876543210",
                    "second_phone": "-",
                    "status": true,
                    "collborators": [],
                    "headcollborator": "Rahul Sharma",
                    "nextfollowup": "-",
                    "lead_source": "Referral",
                    "note": "Interested in product demo"
                },
                {
                    "id": 3,
                    "name": "Sneha Verma",
                    "email": "sneha.verma@example.com",
                    "address": "Pune",
                    "phone": "9988776655",
                    "second_phone": "-",
                    "status": false,
                    "collborators": [],
                    "headcollborator": "Sneha Verma",
                    "nextfollowup": "Next week",
                    "lead_source": "Website",
                    "note": "Requested more details"
                },
                {
                    "id": 4,
                    "name": "Amit Kapoor",
                    "email": "amit.kapoor@example.com",
                    "address": "Delhi",
                    "phone": "9898989898",
                    "second_phone": "-",
                    "status": true,
                    "collborators": [],
                    "headcollborator": "Amit Kapoor",
                    "nextfollowup": "Tomorrow",
                    "lead_source": "Social Media",
                    "note": "Looking for custom features"
                },
                {
                    "id": 5,
                    "name": "Priya Iyer",
                    "email": "priya.iyer@example.com",
                    "address": "Chennai",
                    "phone": "9786543210",
                    "second_phone": "-",
                    "status": false,
                    "collborators": [],
                    "headcollborator": "Priya Iyer",
                    "nextfollowup": "Next month",
                    "lead_source": "Cold Call",
                    "note": "Needs approval from manager"
                },
                {
                    "id": 6,
                    "name": "Rohit Sen",
                    "email": "rohit.sen@example.com",
                    "address": "Kolkata",
                    "phone": "9876541230",
                    "second_phone": "-",
                    "status": true,
                    "collborators": [],
                    "headcollborator": "Rohit Sen",
                    "nextfollowup": "-",
                    "lead_source": "Email Campaign",
                    "note": "Interested in bulk purchase"
                },
                {
                    "id": 7,
                    "name": "Ananya Gupta",
                    "email": "ananya.gupta@example.com",
                    "address": "Hyderabad",
                    "phone": "9654321870",
                    "second_phone": "-",
                    "status": false,
                    "collborators": [],
                    "headcollborator": "Ananya Gupta",
                    "nextfollowup": "Next quarter",
                    "lead_source": "Event",
                    "note": "Met at a tech conference"
                },
                {
                    "id": 8,
                    "name": "Vikram Mehta",
                    "email": "vikram.mehta@example.com",
                    "address": "Ahmedabad",
                    "phone": "9123456780",
                    "second_phone": "-",
                    "status": true,
                    "collborators": [],
                    "headcollborator": "Vikram Mehta",
                    "nextfollowup": "-",
                    "lead_source": "Referral",
                    "note": "Looking for partnership opportunities"
                },
                {
                    "id": 9,
                    "name": "Simran Kaur",
                    "email": "simran.kaur@example.com",
                    "address": "Chandigarh",
                    "phone": "9876547890",
                    "second_phone": "-",
                    "status": false,
                    "collborators": [],
                    "headcollborator": "Simran Kaur",
                    "nextfollowup": "Next week",
                    "lead_source": "Website",
                    "note": "Requested case studies"
                }
            ],
            "columns": [
                "id",
                "name",
                "email",
                "address",
                "phone",
                "second_phone",
                "status",
                "collborators",
                "headcollborator",
                "nextfollowup",
                "lead_source",
                "note"
            ]
        },
        "status": 200
    }

    res.json(data);

}
