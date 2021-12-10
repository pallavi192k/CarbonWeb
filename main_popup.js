console.log("This is the js file for main popup")
const KWG_PER_GB = 1.805;
const RETURNING_VISITOR_PERCENTAGE = 0.75;
const FIRST_TIME_VIEWING_PERCENTAGE = 0.25;
const PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD = 0.02;
const CARBON_PER_KWG_GRID = 475;
const CARBON_PER_KWG_RENEWABLE = 33.4;
const PERCENTAGE_OF_ENERGY_IN_DATACENTER = 0.1008;
const PERCENTAGE_OF_ENERGY_IN_TRANSMISSION_AND_END_USER = 0.8992;
const CO2_GRAMS_TO_LITRES = 0.5562;
//########################################################\\
//                                                        \\
//                    WEEKLY GRAPH                        \\
//                                                        \\
//########################################################\\

function display_graph() {
    if(document.getElementById('weekly_data').style.display === 'none') {
        document.getElementById('weekly_data').style.display = 'inline'
        document.getElementById('site_metrics').style.display = 'none'
    }
    else {
        document.getElementById('weekly_data').style.display = 'none'
        document.getElementById('site_metrics').style.display = 'inline'
    }
}

document.getElementById("report").addEventListener("click", display_graph);

//########################################################\\
//                                                        \\
//             GREEN WEB FOUNDATION API                   \\
//                                                        \\
//########################################################\\

const greenfoundation = 'https://api.thegreenwebfoundation.org/api/v3/greencheck/'

const getHostname = (url) => {
    return new URL(url).hostname;
}

async function update_status(){
    var current_url = null
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
    function(tabs){
        var complete_url = tabs[0].url
        current_url = getHostname(complete_url)
        document.getElementById("URL").innerHTML = "URL: " + current_url;
        var url = greenfoundation + current_url;
        fetch(url)
        .then(response => response.json())  
        .then(json => {
                console.log(json);
                //document.getElementById("API_RESPONSE").innerHTML = JSON.stringify(json);
                if(json.green === true) {
                    console.log("Eco friendly servers")
                    document.getElementById("green_server").innerHTML = "green";
                    document.getElementById("HOSTING_GREEN").innerHTML = "Yayy! This website is hosted on a green server.";
                    document.body.style.backgroundImage = 'url("/icons/wavegreen.svg")';
                }
                else if(json.green === false) {
                    console.log("Non eco friendly servers")
                    document.getElementById("green_server").innerHTML = "red";
                    document.getElementById("HOSTING_GREEN").innerHTML = "Nay! This website is NOT hosted on a green server.";
                    //document.body.style.backgroundColor = '#FF3800';
                    document.body.style.backgroundImage = 'url("/icons/wavered.svg")';
                }
                chrome.storage.sync.set({total_co2: total}, function() {
                    document.getElementById('TOTAL_CO2').innerHTML = "Total Co2: " + total
                });
            }
            )    
        .catch(err => console.log('Request Failed', err)); 
    }
    );
    }

document.getElementById("green_server").addEventListener("click", update_status);


//########################################################\\
//                                                        \\
//           CHROME PAGE SPEED INSIGHTS API               \\
//                                                        \\
//########################################################\\

const page_speed_api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url="
var r;

function page_speed(){
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
    function(tabs){
        var complete_url = page_speed_api + tabs[0].url
        fetch(complete_url)
        .then(response => response.json())  
        .then(obj => {
                r = obj
                console.log(obj);
                var result = obj.lighthouseResult.audits["total-byte-weight"].numericValue / 1000
                var energy_consumption = (result * 1000) * KWG_PER_GB / 1073741824
                var co2 = energy_consumption * CARBON_PER_KWG_GRID
                document.getElementById("CO2_EMITTED").innerHTML = "Co2 produced by this url: " + co2.toString() + "gm";
                document.getElementById("DATA_CONSUMED").innerHTML = "Data consumed by this url: " + result.toString() + " kb";
                update_carbon_footprint(co2);
            }
            )    
        .catch(err => console.log('Request Failed', err)); 
    });
}

document.getElementById("green_server").addEventListener("click", page_speed);


//########################################################\\
//                                                        \\
//             DAY-WISE CARBON FOOTPRINT                  \\
//                                                        \\
//########################################################\\

function update_carbon_footprint(carbon_to_add) {
    console.log("updating co2.....")
    var d = new Date();

    if(d.getDay() === 0) {
        chrome.storage.sync.get(['sunday'], function(result) {
            var updated_value = result.sunday + carbon_to_add
            chrome.storage.sync.set({sunday: updated_value}, function() {
                document.getElementById('sunday').innerHTML = updated_value.toString().substring(0, 5)
            });
            chrome.storage.sync.get(['total_co2'], function(result) {
                var total = result.total_co2 + carbon_to_add
                chrome.storage.sync.set({total_co2: total}, function() {
                    document.getElementById('TOTAL_CO2').innerHTML = "Total Co2: " + total.toString().substring(0, 5)
                });
            });
        });
    }

    if(d.getDay() === 1) {
        chrome.storage.sync.get(['monday'], function(result) {
            var updated_value = result.monday + carbon_to_add
            chrome.storage.sync.set({monday: updated_value}, function() {
                document.getElementById('monday').innerHTML = updated_value
            });
        });
        chrome.storage.sync.get(['total_co2'], function(result) {
            var total = result.total_co2 + carbon_to_add
            chrome.storage.sync.set({total_co2: total}, function() {
                document.getElementById('TOTAL_CO2').innerHTML = total
            });
        });
    }

    if(d.getDay() === 2) {
        chrome.storage.sync.get(['tuesday'], function(result) {
            var updated_value = result.tuesday + carbon_to_add
            chrome.storage.sync.set({tuesday: updated_value}, function() {
                document.getElementById('tuesday').innerHTML = updated_value
            });
        });
        chrome.storage.sync.get(['total_co2'], function(result) {
            var total = result.total_co2 + carbon_to_add
            chrome.storage.sync.set({total_co2: total}, function() {
                document.getElementById('TOTAL_CO2').innerHTML = total
            });
        });
    }

    if(d.getDay() === 3) {
        chrome.storage.sync.get(['wednesday'], function(result) {
            var updated_value = result.wednesday + carbon_to_add
            chrome.storage.sync.set({wednesday: updated_value}, function() {
                document.getElementById('wednesday').innerHTML = updated_value
            });
        });
        chrome.storage.sync.get(['total_co2'], function(result) {
            var total = result.total_co2 + carbon_to_add
            chrome.storage.sync.set({total_co2: total}, function() {
                document.getElementById('TOTAL_CO2').innerHTML = total
            });
        });
    }

    if(d.getDay() === 4) {
        chrome.storage.sync.get(['thursday'], function(result) {
            var updated_value = result.thursday + carbon_to_add
            chrome.storage.sync.set({thursday: updated_value}, function() {
                document.getElementById('thursday').innerHTML = updated_value
            });
        });
        chrome.storage.sync.get(['total_co2'], function(result) {
            var total = result.total_co2 + carbon_to_add
            chrome.storage.sync.set({total_co2: total}, function() {
                document.getElementById('TOTAL_CO2').innerHTML = total
            });
        });
    }

    if(d.getDay() === 5) {
        chrome.storage.sync.get(['friday'], function(result) {
            var updated_value = result.friday + carbon_to_add
            chrome.storage.sync.set({friday: updated_value}, function() {
                document.getElementById('friday').innerHTML = updated_value
            });
        });
        chrome.storage.sync.get(['total_co2'], function(result) {
            var total = result.total_co2 + carbon_to_add
            chrome.storage.sync.set({total_co2: total}, function() {
                document.getElementById('TOTAL_CO2').innerHTML = total
            });
        });
    }

    if(d.getDay() === 6) {
        chrome.storage.sync.get(['saturday'], function(result) {
            var updated_value = result.saturday + carbon_to_add
            chrome.storage.sync.set({saturday: updated_value}, function() {
                document.getElementById('saturday').innerHTML = updated_value
            });
        });
        chrome.storage.sync.get(['total_co2'], function(result) {
            var total = result.total_co2 + carbon_to_add
            chrome.storage.sync.set({total_co2: total}, function() {
                document.getElementById('TOTAL_CO2').innerHTML = total
            });
        });
    }
}

//########################################################\\
//                                                        \\
//                  WEEKLY DATA GRAPH                     \\
//                                                        \\
//########################################################\\

// const labels = [
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday',
//     'Sunday',
//   ];
//   const data = {
//     labels: labels,
//     datasets: [{
//       label: 'Data usage everyday',
//       backgroundColor: 'rgb(0, 0, 0)',
//       borderColor: 'rgb(0, 0, 0)',
//       data: [0, 10, 5, 2, 20, 30, 45, 50],
//     }]
//   };
  
//     const config = {
//     type: 'line',
//     data: data,
//     options: {}
//   };
  
//     // === include 'setup' then 'config' above ===
  
//     var myChart = new Chart(
//       document.getElementById('myChart'),
//       config
//     );