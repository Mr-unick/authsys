




export default function generateDashboard(user:any){
    let dashboardProps : any;

    if(user?.role=='Admin'){
        dashboardProps = {
            yearchart : {
                title : 'Yearly Trend',
                data: [
                    { month: "January", desktop: 186, mobile: 100 },
                    { month: "February", desktop: 305, mobile: 120 },
                    { month: "March", desktop: 237, mobile: 95 },
                    { month: "April", desktop: 73, mobile: 60 },
                    { month: "May", desktop: 209, mobile: 140 },
                    { month: "June", desktop: 214, mobile: 130 },
                    { month: "July", desktop: 174, mobile: 110 },
                    { month: "August", desktop: 114, mobile: 80 },
                    { month: "September", desktop: 154, mobile: 90 },
                    { month: "November", desktop: 24, mobile: 20 },
                    { month: "December", desktop: 214, mobile: 150 },
                ]
            },
            leadsource : {
                title : 'Lead Source',
                data: {
                    visitors: {
                        label: "Visitors",
                    },
                    firefox: {
                        label: "Firefox",
                        color: "hsl(215, 100%, 50%)", // Royal Blue
                    },
                    edge: {
                        label: "Edge",
                        color: "hsl(210, 80%, 55%)", // Steel Blue
                    },
                    other: {
                        label: "Other",
                        color: "hsl(210, 40%, 60%)", // Light Steel Blue
                    },
                }
            },
            performance : {
                title : 'Performance',
                data: [
                    { month: "Sam", assigned: 186, conversions: 80 },
                    { month: "John", assigned: 86, conversions: 20 },
                    { month: "jane", assigned: 16, conversions: 8 },
                    { month: "Nick", assigned: 126, conversions: 100 },
                    { month: "Peter", assigned: 86, conversions: 30 },
                ]
            },salespersons : [
                { id: 1, username: 'johndoe', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'john@example.com', assignedLeads: 24, conversionPercentage: 33 }
            ]
        }
    } else if (user?.role =='Buisness Admin'){
        dashboardProps = {
            yearchart: {
                title: 'Yearly Trend',
                chartConfig: {
                    assigned: {
                        label: "assigned",
                        color: "#60a5fa",
                    },
                    conversions: {
                        label: "conversions",
                        color: "#60a5fa",
                    },
                },
                data: [
                    {
                        column: "jan", 
                        assigned: {
                            value: 20,
                            color: "#2563eb"
                        }, 
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    }
                ]
            },
            leadsource: {
                title: 'Lead Source',
                data: {
                    visitors: {
                        label: "Visitors",
                    },
                    firefox: {
                        label: "Firefox",
                        color: "hsl(215, 100%, 50%)", // Royal Blue
                    },
                    edge: {
                        label: "Edge",
                        color: "hsl(210, 80%, 55%)", // Steel Blue
                    },
                    other: {
                        label: "Other",
                        color: "hsl(210, 40%, 60%)", // Light Steel Blue
                    },
                }
            },
            performance: {
                title: 'Performance',
                chartConfig :{
                    assigned: {
                        label: "assigned",
                        color: "#60a5fa",
                    },
                    conversions: {
                        label: "conversions",
                        color: "#60a5fa",
                    },
                } ,
                data: [
                    {
                        column: "Nikhil",
                        assigned: {
                            value: 20,
                            color: "#2563eb"
                        },
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    },
                    {
                        column: "Suv",
                        assigned: {
                            value: 10,
                            color: "#2563eb"
                        },
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    }
                ]
            }, salespersons: {
                title : 'Sales Persons',
                data : [
                    { id: 1, username: 'johndoe', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'john@example.com', assignedLeads: 24, conversionPercentage: 33 }
                ]
            }
        } 
    } else {
        dashboardProps = {
           
            leadsource: {
                title: 'Leads',
                data: {
                    visitors: {
                        label: "PendingLeads",
                    },
                    firefox: {
                        label: "Firefox",
                        color: "hsl(215, 100%, 50%)", 
                    },
                    edge: {
                        label: "Edge",
                        color: "hsl(210, 80%, 55%)", 
                    },
                    other: {
                        label: "Other",
                        color: "hsl(210, 40%, 60%)",
                    },
                }
            },
            performance: {
                title: 'Performance',
                chartConfig: {
                    assigned: {
                        label: "assigned",
                        color: "#60a5fa",
                    },
                    conversions: {
                        label: "conversions",
                        color: "#60a5fa",
                    },
                },
                data: [
                    {
                        column: "Nikhil",
                        assigned: {
                            value: 20,
                            color: "#2563eb"
                        },
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    },
                    {
                        column: "Suv",
                        assigned: {
                            value: 10,
                            color: "#2563eb"
                        },
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    }
                ]
            },
            notifications: {
                title : 'Notifications',
                data : [
                    { id: 1, title: 'New Lead', message: 'New lead assigned to you', time: '10 minutes ago' }
                ]
            },
            newleads : {    
                title : 'New Leads',
                data : [
                    { id: 1, title: 'New Lead', message: 'New lead assigned to you', time: '10 minutes ago' }
                ]
            }
        }
    }


    return dashboardProps;
}
