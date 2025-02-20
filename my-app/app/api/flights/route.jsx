export async function GET() {
    return Response.json([
        {
            id: 1,
            airline: "Hawaiian Airlines",
            duration: "16h 45m",
            departure: "7:00AM",
            arrival: "4:15PM",
            stops: "1 stop",
            layover: "2h 45m in HNL",
            price: 624
        },
        {
            id: 2,
            airline: "Delta Airlines",
            duration: "8h 30m",
            departure: "9:00AM",
            arrival: "5:30PM",
            stops: "Non-stop",
            layover: "—",
            price: 450
        },
        {
            id: 3,
            airline: "American Airlines",
            duration: "12h 10m",
            departure: "6:00AM",
            arrival: "6:10PM",
            stops: "1 stop",
            layover: "1h 20m in JFK",
            price: 540
        },
        {
            id: 4,
            airline: "United Airlines",
            duration: "10h 15m",
            departure: "2:00PM",
            arrival: "12:15AM",
            stops: "2 stops",
            layover: "2h in ORD, 1h 30m in LAX",
            price: 380
        },
        {
            id: 5,
            airline: "Southwest Airlines",
            duration: "5h 50m",
            departure: "11:00AM",
            arrival: "4:50PM",
            stops: "Non-stop",
            layover: "—",
            price: 320
        },
        {
            id: 6,
            airline: "Emirates",
            duration: "18h 25m",
            departure: "10:30PM",
            arrival: "5:55PM",
            stops: "1 stop",
            layover: "4h in DXB",
            price: 980
        },
        {
            id: 7,
            airline: "Lufthansa",
            duration: "14h 10m",
            departure: "3:00PM",
            arrival: "5:10AM",
            stops: "1 stop",
            layover: "2h 30m in FRA",
            price: 720
        },
        {
            id: 8,
            airline: "Qatar Airways",
            duration: "20h 40m",
            departure: "12:00AM",
            arrival: "8:40PM",
            stops: "2 stops",
            layover: "3h in DOH, 2h in JFK",
            price: 1100
        },
        {
            id: 9,
            airline: "Turkish Airlines",
            duration: "13h 55m",
            departure: "6:45PM",
            arrival: "8:40AM",
            stops: "1 stop",
            layover: "2h 15m in IST",
            price: 660
        },
        {
            id: 10,
            airline: "JetBlue",
            duration: "6h 30m",
            departure: "7:15AM",
            arrival: "1:45PM",
            stops: "Non-stop",
            layover: "—",
            price: 390
        }
    ]);
}

