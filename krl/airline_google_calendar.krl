ruleset a1299x153 {
    meta {
		name "Airline Google Calendar"
		description <<
			
		>>
		author "nathan cerny"
		logging on
        use module a1299x144 version "dev" alias expedia 
        use module a1299x156 alias calendar_event_click
        use module a1299x157 alias calendar_writers
        use module a1299x158 alias base_loaders
        use css resource "https://dl.dropbox.com/u/57162158/twitter-bootstrap/css/bootstrap.css"
        use css resource "https://dl.dropbox.com/u/57162158/airline_calendar/css/bootstrap_child.css"
        use javascript resource "https://dl.dropbox.com/u/57162158/twitter-bootstrap/js/kynetx-bootstrap-tabs.js"
        use javascript resource "https://dl.dropbox.com/u/57162158/jquery.raty-2.1.0/js/jquery.raty.min.js"
        use javascript resource "https://dl.dropbox.com/u/57162158/airline_calendar/js/project.js"
	}

	dispatch {
	    domain "google.com"
	}

	global {
        app_rid = page:env('rid');
	}

    rule cars {
        select when web cars_data
        pre{
            calendar_id = event:param('calendar_id');
            reg_number = event:param('reg_number');
            search_data = event:param('search_params').decode();
            search_hash = {
                "cityCode" : "LAX",
                "pickUpDate" : search_data.pick("$..from_date"),
                "dropOffDate" : search_data.pick("$..until_date"),
                //"classCode" : "S",
                "pickUpTime" : "9AM",
                "dropOffTime" : "9AM",
                "sortMethod" : "0",
                "currencyCode" : "USD"
            };
            search_results = expedia:cars_available(search_hash);
        }
        {
            emit <<
                console.log('car data');
                console.log(search_results);
                console.log(search_hash);
                var listener = KY_LIBRARY.listener;
                listener.dataReturned(reg_number, 'cars', calendar_id, search_results);
            >>;
        }
    
    }


    rule hotels {
        select when web hotels_data
        pre{
            calendar_id = event:param('calendar_id');  
            reg_number = event:param('reg_number');
            search_data = event:param('search_params').decode();
            agent = useragent:string();
            user_ip = page:env('ip');
            search_hash = {
                "customerUserAgent" :  agent,
                "customerIpAddress" : user_ip,
                "city" : search_data.pick('$..where'),
                "stateProvinceCode" : 'CA',
                "countryCode" : 'US',
                "arrivalDate" : search_data.pick('$..from_date'),
                "departureDate" : search_data.pick('$..until_date'),
                "room1" : 2,
                "numberOfResults" : 20
            };
            search_results = expedia:hotels_available(search_hash);
            
        }
        {
            emit <<
                console.log('data', calendar_id, 'end');
                console.log('searching for ');
                console.log(search_data);
                console.log(search_hash);
                console.log(search_results);
                var listener = KY_LIBRARY.listener;
                listener.dataReturned(reg_number, 'hotels', calendar_id ,search_results);
                
            >>;
        }
    }

	rule first_rule {
		select when pageview "https://www.google.com/calendar/.*" setting ()
		pre {
		
		}
        {
            // place the listener on the page.  This allows me to add in logic from the page without touching the 
            // rest of the application
            // This gives me control of loading order
            
        emit <<
            
            
            console.log(KY_LIBRARY);
            var calendar = KY_LIBRARY.EXPEDIA_CALENDAR; 
            var ev = Object.create(KY_LIBRARY.events.default_event());
           // console.log(KY_LIBRARY.EXPEDIA_CALENDAR);
            ev.init ({
                'shell' : KY_LIBRARY.EXPEDIA_CALENDAR.default_shell,
                'listener_name' : 'calendar_event_click',
                'templates' : {
                    'cars' : Object.create(calendar.cars()),
                    'hotels' : Object.create(calendar.hotels())
                    
                }
            });
            
            KY_LIBRARY.listener.addEvent('calendar_event_click', ev);
            
         //   console.log('cal ', calendar);
            
        >>;
		    notify("Calendar App Is Loading", "The app rocks");
        }
	}
    
    
}


