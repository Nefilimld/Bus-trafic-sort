/**
 * Levels Data & Infinite Solvable Level Generator
 * Scales vehicle counts smoothly: Level 1 has 8 buses, Level 2 has 10, Level 3 has 12...
 * Every bus holds 20 passengers to match the rhythmic 3-in-a-row boarding flow.
 */

const HANDCRAFTED_LEVELS = [
    {
        "level": 1,
        "activeSlots": 4,
        "buses": [
            {
                "x": -1.8,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 1.6,
                "rot": -1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 3.2,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 3.2,
                "rot": -1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 3.2,
                "rot": -0.785,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 3.2,
                "rot": 0.785,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 60
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 40
            }
        ]
    },
    {
        "level": 2,
        "activeSlots": 4,
        "buses": [
            {
                "x": -1.8,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 3.2,
                "rot": 1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 3.2,
                "rot": -1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 3.2,
                "rot": -0.785,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 3.2,
                "rot": 0.785,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 4.8,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 4.8,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 60
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 40
            },
            {
                "color": "green",
                "count": 40
            }
        ]
    },
    {
        "level": 3,
        "activeSlots": 4,
        "buses": [
            {
                "x": -1.8,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 3.2,
                "rot": 1.57,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 3.2,
                "rot": -1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 3.2,
                "rot": -0.785,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 3.2,
                "rot": 0.785,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 4.8,
                "rot": 0,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 4.8,
                "rot": 1.57,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 4.8,
                "rot": -1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 4.8,
                "rot": 0,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 60
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 40
            },
            {
                "color": "green",
                "count": 40
            },
            {
                "color": "purple",
                "count": 40
            }
        ]
    },
    {
        "level": 4,
        "activeSlots": 4,
        "buses": [
            {
                "x": -1.8,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 3.2,
                "rot": 1.57,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 3.2,
                "rot": -1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 3.2,
                "rot": -0.785,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 3.2,
                "rot": 0.785,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 4.8,
                "rot": 0,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 4.8,
                "rot": 1.57,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 4.8,
                "rot": -1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 4.8,
                "rot": 0,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 6.4,
                "rot": 1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 6.4,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 60
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 60
            },
            {
                "color": "green",
                "count": 60
            },
            {
                "color": "purple",
                "count": 40
            }
        ]
    },
    {
        "level": 5,
        "activeSlots": 4,
        "buses": [
            {
                "x": -1.8,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 3.2,
                "rot": 1.57,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 3.2,
                "rot": -1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 3.2,
                "rot": -0.785,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 3.2,
                "rot": 0.785,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 4.8,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 4.8,
                "rot": 1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 4.8,
                "rot": -1.57,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 4.8,
                "rot": 0,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.8,
                "z": 6.4,
                "rot": 1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -0.6,
                "z": 6.4,
                "rot": -1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.6,
                "z": 6.4,
                "rot": -0.785,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.8,
                "z": 6.4,
                "rot": 0.785,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 60
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 60
            },
            {
                "color": "green",
                "count": 60
            },
            {
                "color": "purple",
                "count": 40
            },
            {
                "color": "orange",
                "count": 40
            }
        ]
    },
    {
        "level": 6,
        "activeSlots": 4,
        "buses": [
            {
                "x": -2.4,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 1.6,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 3.2,
                "rot": -0.785,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 3.2,
                "rot": 0.785,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 3.2,
                "rot": 1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 4.8,
                "rot": 0,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 4.8,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 4.8,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 6.4,
                "rot": 1.57,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 6.4,
                "rot": -1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 60
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 60
            },
            {
                "color": "green",
                "count": 60
            },
            {
                "color": "purple",
                "count": 60
            },
            {
                "color": "orange",
                "count": 60
            }
        ]
    },
    {
        "level": 7,
        "activeSlots": 4,
        "buses": [
            {
                "x": -2.4,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 1.6,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 3.2,
                "rot": -0.785,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 3.2,
                "rot": 0.785,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 3.2,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 4.8,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 4.8,
                "rot": 0,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 4.8,
                "rot": 1.57,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 6.4,
                "rot": 1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 6.4,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 6.4,
                "rot": -0.785,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 60
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 60
            },
            {
                "color": "green",
                "count": 60
            },
            {
                "color": "purple",
                "count": 60
            },
            {
                "color": "orange",
                "count": 60
            },
            {
                "color": "cyan",
                "count": 40
            }
        ]
    },
    {
        "level": 8,
        "activeSlots": 4,
        "buses": [
            {
                "x": -2.4,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 1.6,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 3.2,
                "rot": -0.785,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 3.2,
                "rot": 0.785,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 3.2,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 4.8,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 4.8,
                "rot": 0,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 4.8,
                "rot": 1.57,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 6.4,
                "rot": 1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 6.4,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 6.4,
                "rot": -0.785,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 8.0,
                "rot": 0,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 8.0,
                "rot": 1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 80
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 60
            },
            {
                "color": "green",
                "count": 60
            },
            {
                "color": "purple",
                "count": 60
            },
            {
                "color": "orange",
                "count": 60
            },
            {
                "color": "cyan",
                "count": 60
            }
        ]
    },
    {
        "level": 9,
        "activeSlots": 4,
        "buses": [
            {
                "x": -2.4,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 1.6,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 3.2,
                "rot": -0.785,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 3.2,
                "rot": 0.785,
                "color": "magenta",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 3.2,
                "rot": 1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 4.8,
                "rot": 0,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 4.8,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 4.8,
                "rot": 1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "magenta",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 6.4,
                "rot": 1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 6.4,
                "rot": -1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 6.4,
                "rot": -0.785,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 8.0,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 8.0,
                "rot": 1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 8.0,
                "rot": -1.57,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 8.0,
                "rot": 0,
                "color": "magenta",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 60
            },
            {
                "color": "blue",
                "count": 60
            },
            {
                "color": "yellow",
                "count": 60
            },
            {
                "color": "green",
                "count": 60
            },
            {
                "color": "purple",
                "count": 60
            },
            {
                "color": "orange",
                "count": 60
            },
            {
                "color": "cyan",
                "count": 60
            },
            {
                "color": "magenta",
                "count": 60
            }
        ]
    },
    {
        "level": 10,
        "activeSlots": 4,
        "buses": [
            {
                "x": -2.4,
                "z": 1.6,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 1.6,
                "rot": 1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 1.6,
                "rot": 0,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 1.6,
                "rot": -1.57,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 1.6,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 3.2,
                "rot": -0.785,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 3.2,
                "rot": 0.785,
                "color": "magenta",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 3.2,
                "rot": 1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 3.2,
                "rot": -1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 4.8,
                "rot": 0,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 4.8,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 4.8,
                "rot": 1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 4.8,
                "rot": -1.57,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "magenta",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 6.4,
                "rot": 1.57,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 6.4,
                "rot": -1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 6.4,
                "rot": -0.785,
                "color": "yellow",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 6.4,
                "rot": 0.785,
                "color": "green",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 8.0,
                "rot": 0,
                "color": "purple",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -1.2,
                "z": 8.0,
                "rot": 1.57,
                "color": "orange",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 0.0,
                "z": 8.0,
                "rot": -1.57,
                "color": "cyan",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 1.2,
                "z": 8.0,
                "rot": 0,
                "color": "magenta",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": 2.4,
                "z": 8.0,
                "rot": 0,
                "color": "red",
                "capacity": 20,
                "type": "normal"
            },
            {
                "x": -2.4,
                "z": 9.6,
                "rot": -1.57,
                "color": "blue",
                "capacity": 20,
                "type": "normal"
            }
        ],
        "queue": [
            {
                "color": "red",
                "count": 80
            },
            {
                "color": "blue",
                "count": 80
            },
            {
                "color": "yellow",
                "count": 60
            },
            {
                "color": "green",
                "count": 60
            },
            {
                "color": "purple",
                "count": 60
            },
            {
                "color": "orange",
                "count": 60
            },
            {
                "color": "cyan",
                "count": 60
            },
            {
                "color": "magenta",
                "count": 60
            }
        ]
    }
];

class LevelManager {
    /**
     * Get Level by number (Handcrafted for 1-10, Procedural for 11+)
     */
    static getLevel(levelNum) {
        let levelData;
        if (levelNum <= HANDCRAFTED_LEVELS.length) {
            levelData = JSON.parse(JSON.stringify(HANDCRAFTED_LEVELS[levelNum - 1]));
        } else {
            levelData = LevelManager.generateProceduralLevel(levelNum);
        }

        // Milestone slot unlocks:
        // Level 1-2: 4 active slots (3 locked)
        // Level 3-4: 5 active slots (Slot 5 unlocked at Level 3)
        // Level 5-6: 6 active slots (Slot 6 unlocked at Level 5)
        // Level 7+: 7 active slots (Slot 7 unlocked at Level 7)
        if (levelNum >= 7) {
            levelData.activeSlots = 7;
        } else if (levelNum >= 5) {
            levelData.activeSlots = 6;
        } else if (levelNum >= 3) {
            levelData.activeSlots = 5;
        } else {
            levelData.activeSlots = 4;
        }

        return levelData;
    }

    /**
     * Infinite Solvable Procedural Level Generator
     */
    static generateProceduralLevel(levelNum) {
        let seed = levelNum * 1337 + 42;
        const random = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        const availableColors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'cyan', 'magenta'];
        const numColors = Math.min(8, 4 + Math.floor((levelNum - 10) / 3));
        const activeColors = availableColors.slice(0, numColors);

        // Scales by +2 buses per level: Level 11 -> 28 buses, etc.
        const busCount = Math.min(32, 8 + (levelNum - 1) * 2);
        const buses = [];
        const queueMap = {};
        activeColors.forEach(c => queueMap[c] = 0);

        const cols = 5;
        const rows = Math.ceil(busCount / cols);
        const startZ = 1.6;
        const spacingX = 1.25;
        const spacingZ = 1.55;

        const angles = [0, 0, -0.785, 0.785, 1.57, -1.57];

        let created = 0;
        for (let r = 0; r < rows; r++) {
            const z = startZ + r * spacingZ;
            const itemsInRow = Math.min(cols, busCount - created);
            const rowStartX = -((itemsInRow - 1) * spacingX) / 2;

            for (let c = 0; c < itemsInRow; c++) {
                const x = rowStartX + c * spacingX;
                let rot = 0;
                if (r === 0) {
                    rot = c % 2 === 0 ? 0 : (c === 1 ? 1.57 : -1.57);
                } else if (r % 2 === 1) {
                    rot = angles[Math.floor(random() * angles.length)];
                } else {
                    rot = random() > 0.4 ? 0 : 1.57;
                }

                const color = activeColors[Math.floor(random() * activeColors.length)];
                const capacity = 20;

                buses.push({
                    x: Number(x.toFixed(2)),
                    z: Number(z.toFixed(2)),
                    rot: rot,
                    color: color,
                    capacity: capacity,
                    type: 'normal'
                });

                queueMap[color] += capacity;
                created++;
                if (created >= busCount) break;
            }
            if (created >= busCount) break;
        }

        const queue = [];
        for (const [color, count] of Object.entries(queueMap)) {
            if (count > 0) {
                queue.push({ color: color, count: count });
            }
        }

        return {
            level: levelNum,
            activeSlots: 4,
            buses: buses,
            queue: queue
        };
    }
}

window.LevelManager = LevelManager;
