/* =========================================================
   STREET LEGENDS
   GARAGE SYSTEM
========================================================= */


/* =========================================================
   RENDER GARAGE
========================================================= */

function renderGarage() {

    const garageGrid =
        document.getElementById(
            "garageGrid"
        );


    if (!garageGrid) {

        return;

    }


    garageGrid.innerHTML = "";


    if (
        player.cars.length === 0
    ) {

        garageGrid.innerHTML = `

            <div class="empty-garage">

                <div>
                    🚗
                </div>

                <h3>
                    Garage ცარიელია
                </h3>

                <p>
                    იყიდე შენი პირველი მანქანა.
                </p>

            </div>

        `;

        return;

    }


    player.cars.forEach(
        carId => {

            const car =
                getCar(carId);


            if (!car) {

                return;

            }


            garageGrid.appendChild(
                createGarageCard(car)
            );

        }
    );

}


/* =========================================================
   CREATE GARAGE CARD
========================================================= */

function createGarageCard(
    car
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "car-card";


    const isSelected =
        player.selectedCar ===
        car.id;


    const classInfo =
        CAR_CLASSES[
            car.class
        ];


    card.innerHTML = `

        <div
            class="car-image"
            style="
                border-bottom:
                3px solid
                ${classInfo.color};
            "
        >

            <span>
                ${car.emoji}
            </span>

        </div>


        <div class="car-info">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:8px;
                "
            >

                <div>

                    <h3>
                        ${car.brand}
                        ${car.name}
                    </h3>

                    <div class="car-type">
                        ${car.type}
                    </div>

                </div>


                <strong
                    style="
                        color:
                        ${classInfo.color};
                        font-size:12px;
                    "
                >
                    ${car.class}
                </strong>

            </div>


            <div class="car-power">

                POWER

                <strong>
                    ${getCarPower(car)}
                </strong>

            </div>


            ${createStatHTML(
                "SPEED",
                car.stats.speed,
                500
            )}


            ${createStatHTML(
                "ACCELERATION",
                car.stats.acceleration,
                100
            )}


            ${createStatHTML(
                "HANDLING",
                car.stats.handling,
                100
            )}


            ${createStatHTML(
                "BRAKING",
                car.stats.braking,
                100
            )}


            ${createStatHTML(
                "NITRO",
                car.stats.nitro,
                100
            )}


            <div
                style="
                    display:flex;
                    gap:8px;
                    margin-top:18px;
                "
            >

                <button
                    class="garage-select-btn"
                    onclick="
                        selectGarageCar(
                            '${car.id}'
                        )
                    "
                    style="
                        flex:1;
                        padding:11px;
                        border:none;
                        border-radius:7px;
                        cursor:pointer;
                        color:white;
                        font-weight:bold;
                        background:
                        ${
                            isSelected
                            ? "#22c55e"
                            : "#ff3b30"
                        };
                    "
                >

                    ${
                        isSelected
                        ? "✓ SELECTED"
                        : "SELECT"
                    }

                </button>


                <button
                    onclick="
                        openUpgradePanel(
                            '${car.id}'
                        )
                    "
                    style="
                        width:48px;
                        border:none;
                        border-radius:7px;
                        cursor:pointer;
                        background:#252b35;
                        color:white;
                        font-size:18px;
                    "
                >
                    🔧
                </button>

            </div>

        </div>

    `;


    return card;

}


/* =========================================================
   CREATE STAT
========================================================= */

function createStatHTML(
    name,
    value,
    max
) {

    const percentage =
        Math.min(
            (
                value /
                max
            ) * 100,
            100
        );


    return `

        <div class="car-stat">

            <div
                class="car-stat-header"
            >

                <span>
                    ${name}
                </span>

                <span>
                    ${value}
                </span>

            </div>


            <div class="stat-line">

                <span
                    style="
                        width:
                        ${percentage}%;
                    "
                ></span>

            </div>

        </div>

    `;

}


/* =========================================================
   SELECT CAR FROM GARAGE
========================================================= */

function selectGarageCar(
    carId
) {

    if (
        selectCar(carId)
    ) {

        showNotification(
            `🚗 ${getCar(carId).brand} ${getCar(carId).name} არჩეულია`
        );

    }


    renderGarage();

}


/* =========================================================
   UPGRADE PANEL
========================================================= */

function openUpgradePanel(
    carId
) {

    const car =
        getCar(carId);


    if (!car) {

        return;

    }


    let modal =
        document.getElementById(
            "upgradeModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );


        modal.id =
            "upgradeModal";


        modal.style.position =
            "fixed";

        modal.style.inset =
            "0";

        modal.style.background =
            "rgba(0,0,0,.75)";

        modal.style.zIndex =
            "9990";

        modal.style.display =
            "flex";

        modal.style.alignItems =
            "center";

        modal.style.justifyContent =
            "center";

        modal.style.padding =
            "20px";


        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div
            style="
                width:min(
                    500px,
                    100%
                );
                max-height:90vh;
                overflow:auto;
                background:#11151d;
                border:1px solid #2b323d;
                border-radius:18px;
                padding:25px;
                box-shadow:
                0 25px 80px
                rgba(0,0,0,.6);
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:20px;
                "
            >

                <div>

                    <h2>
                        🔧 ${car.brand}
                        ${car.name}
                    </h2>

                    <p
                        style="
                            color:#8d96a5;
                            margin-top:5px;
                        "
                    >
                        Upgrade your car
                    </p>

                </div>


                <button
                    onclick="closeUpgradePanel()"
                    style="
                        border:none;
                        background:#252b35;
                        color:white;
                        width:35px;
                        height:35px;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >
                    ✕
                </button>

            </div>


            ${createUpgradeRow(
                car,
                "engine",
                "ENGINE",
                "🚀"
            )}


            ${createUpgradeRow(
                car,
                "turbo",
                "TURBO",
                "⚡"
            )}


            ${createUpgradeRow(
                car,
                "tires",
                "TIRES",
                "🛞"
            )}


            ${createUpgradeRow(
                car,
                "brakes",
                "BRAKES",
                "🛑"
            )}


            ${createUpgradeRow(
                car,
                "suspension",
                "SUSPENSION",
                "🔩"
            )}


            ${createUpgradeRow(
                car,
                "gearbox",
                "GEARBOX",
                "⚙️"
            )}

        </div>

    `;


    modal.style.display =
        "flex";

}


/* =========================================================
   CREATE UPGRADE ROW
========================================================= */

function createUpgradeRow(
    car,
    type,
    name,
    icon
) {

    const level =
        car.upgrades[
            type
        ];


    const maxLevel =
        10;


    const basePrice =
        upgradePrices[
            type
        ];


    const price =
        basePrice *
        (
            level + 1
        );


    const disabled =
        level >= maxLevel;


    return `

        <div
            style="
                background:#171c25;
                border:1px solid #262d38;
                border-radius:12px;
                padding:15px;
                margin-bottom:10px;
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                "
            >

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    "
                >

                    <span
                        style="
                            font-size:22px;
                        "
                    >
                        ${icon}
                    </span>

                    <div>

                        <strong>
                            ${name}
                        </strong>

                        <div
                            style="
                                color:#8d96a5;
                                font-size:11px;
                                margin-top:3px;
                            "
                        >
                            Level
                            ${level}/${maxLevel}
                        </div>

                    </div>

                </div>


                <button
                    ${
                        disabled
                        ? "disabled"
                        : ""
                    }
                    onclick="
                        upgradeCar(
                            '${car.id}',
                            '${type}'
                        );
                        openUpgradePanel(
                            '${car.id}'
                        );
                    "
                    style="
                        border:none;
                        border-radius:7px;
                        padding:9px 12px;
                        cursor:
                        ${
                            disabled
                            ? "not-allowed"
                            : "pointer"
                        };
                        color:white;
                        background:
                        ${
                            disabled
                            ? "#333"
                            : "#ff3b30"
                        };
                        font-size:11px;
                        font-weight:bold;
                    "
                >

                    ${
                        disabled
                        ? "MAX"
                        : "$" +
                          price.toLocaleString()
                    }

                </button>

            </div>


            <div
                style="
                    display:flex;
                    gap:4px;
                    margin-top:12px;
                "
            >

                ${createUpgradeBars(
                    level,
                    maxLevel
                )}

            </div>

        </div>

    `;

}


/* =========================================================
   UPGRADE LEVEL BARS
========================================================= */

function createUpgradeBars(
    level,
    max
) {

    let html = "";


    for (
        let i = 0;
        i < max;
        i++
    ) {

        html += `

            <div
                style="
                    height:4px;
                    flex:1;
                    border-radius:3px;
                    background:
                    ${
                        i < level
                        ? "#ff3b30"
                        : "#303640"
                    };
                "
            ></div>

        `;

    }


    return html;

}


/* =========================================================
   CLOSE UPGRADE PANEL
========================================================= */

function closeUpgradePanel() {

    const modal =
        document.getElementById(
            "upgradeModal"
        );


    if (modal) {

        modal.remove();

    }

}


/* =========================================================
   INITIALIZE GARAGE
========================================================= */

function initializeGarage() {

    renderGarage();

}
