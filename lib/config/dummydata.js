'use strict';

var mongoose = require("mongoose"),
    User = mongoose.model("User"),
    Sponsor = mongoose.model("Sponsor"),
    Person = mongoose.model("Person"),
    Property = mongoose.model("Property"),
    Deal = mongoose.model("Deal"),
    Investment = mongoose.model("Investment");

//
// Populate database with sample application data
//

//
// Clear old users, then add a default user
//
User.find({}).remove(function() {

    // Create accredited user
    User.create({
        provider: 'local',
        firstName: 'Tom',
        lastName: 'Jones',
        email: 'test@test.com',
        phone: '2121231234',
        password: '123',
        active: true,
        activationKey: "123abc",
        activationKeyExpiryDate: new Date(),
        accreditedInvestor: true,
        lastAccreditedDate: new Date()
    });

    // Create non-accredited user
    User.create({
        provider: 'local',
        firstName: 'Sam',
        lastName: 'Sneed',
        email: 'non@test.com',
        phone: '2121231234',
        password: '123',
        active: true,
        activationKey: "123abc",
        activationKeyExpiryDate: new Date(),
        accreditedInvestor: false
    });

    // Create admin
    User.create({
        provider: 'local',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        phone: '2122232234',
        password: '123',
        role: "admin",
        active: true,
        activationKey: "456def",
        activationKeyExpiryDate: new Date(),
        accreditedInvestor: true,
        lastAccreditedDate: new Date()
    });

    // Create Tabish
    User.create({
        provider: 'local',
        firstName: 'Tabish',
        lastName: 'Rizvi',
        email: 'tabish89@gmail.com',
        phone: '2123233234',
        password: '123123',
        role: "admin",
        active: true,
        activationKey: "456def",
        activationKeyExpiryDate: new Date(),
        accreditedInvestor: true,
        lastAccreditedDate: new Date()
    });

    // Create Robin
    User.create({
        provider: 'local',
        firstName: 'Robin',
        lastName: 'Halsey',
        email: 'robinrhalsey@gmail.com',
        phone: '2124234234',
        password: '123123',
        role: "admin",
        active: true,
        activationKey: "456def",
        activationKeyExpiryDate: new Date(),
        accreditedInvestor: true,
        lastAccreditedDate: new Date()
    });

    // Create user who has not yet activated
    User.create({
        provider: 'local',
        firstName: 'Lego',
        lastName: 'Man',
        email: 'mim+1@clevercanary.com',
        phone: '2125235234',
        password: '123',
        active: false,
        activationKey: "789ghi",
        activationKeyExpiryDate: new Date(),
        accreditedInvestor: false
    });

    // Create user for Mim
    User.create({
        provider: 'local',
        firstName: 'Mim',
        lastName: 'Hastie',
        email: 'mim@clevercanary.com',
        phone: '2126236234',
        password: '123',
        active: true,
        activationKey: "789ghi",
        activationKeyExpiryDate: new Date(),
        accreditedInvestor: true,
        lastAccreditedDate: new Date()
    });

    // Create user for Dave
    User.create({
        provider: 'local',
        firstName: 'David',
        lastName: 'Rogers',
        email: 'dave@clevercanary.com',
        phone: '2127237234',
        password: '123',
        active: true,
        activationKey: "789ghi",
        activationKeyExpiryDate: new Date(),
        accreditedInvestor: true,
        lastAccreditedDate: new Date()
    });
});

//
// Add dummy sponsor data
//
Sponsor.find({}).remove(function() {

    // Clear all people
    Person.find().remove(function() {

        Sponsor.create({
            name: "Neighborhood Development Company",
            description:"Bacon ipsum dolor sit amet cow spare ribs biltong flank jerky. Turkey drumstick kevin porchetta shankle, salami hamburger meatloaf bacon. Ribeye drumstick short loin, porchetta kielbasa kevin frankfurter bacon pig cow hamburger sirloin. Ham meatball pastrami, pork chop bresaola pancetta sausage venison sirloin landjaeger turkey. Short ribs shoulder shank, jowl cow ham pork chop turducken spare ribs sirloin corned beef. Shank salami jerky short loin jowl bacon tongue. Leberkas corned beef flank swine shankle pork chop pancetta, pig drumstick ribeye pork loin brisket beef ribs.",
            location: "New York, NY",
            url:"neighborhooddevelopment.com",
            type: "Retail",
            numberOfDeals: "3",
            sectionHeading:"Featured Properties",
            option0Name: "Under Management",
            option0Value: "2 Million",
            option1Name: "Developed",
            option1Value: "1,000"
        }, function(error, sponsor) {

            Person.create({
                name:"Peter Piper",
                role:"Managing Director",
                bio:"Bacon ipsum dolor sit amet turducken beef brisket venison chuck ham hock pig drumstick ground round chicken tri-tip tail ham frankfurter. Sirloin shankle pastrami hamburger.",
                linkedinUrl:"linkedin.com",
                sponsorId:sponsor
            });

            Person.create({
                name:"Samantha Sneed",
                role:"Real Estate Executive",
                bio:"Bear claw lemon drops powder chocolate cake gingerbread. Tootsie roll apple pie carrot cake donut candy macaroon candy canes. Chocolate jelly-o chocolate cake bear claw bear claw marshmallow powder halvah.",
                linkedinUrl:"linkedin.com",
                sponsorId:sponsor
            });

            Person.create({
                name:"John Johnson Junior",
                role:"Associate",
                bio:"Flying characin piranha jewfish monkfish mustache triggerfish dwarf loach. Giant gourami crocodile shark gunnel bass swordtail sand knifefish deep sea anglerfish Manta Ray? Northern sea robin, deepwater stingray kappy knifejaw threadfin tarpon three-toothed puffer nase flyingfish. Tiger shovelnose catfish, basslet broadband dogfish Atlantic salmon, Mexican blind cavefish flagblenny spiny-back, bigmouth buffalo pike conger ladyfish marine hatchetfish blue gourami wrymouth.",
                linkedinUrl:"linkedin.com",
                sponsorId:sponsor
            });

            Property.create({
                name: "Autozone Redev. - 1207 H St NE",
                location: "1207 H St NE • Washington, DC 20002",
                picture: "/images/img_sponsor_project_0.jpg",
                description: "An approximately 1-acre property, currently occupied by AutoZone, operating under a ground-lease. In the long-term the property has great development potential, the site can accommodate roughly 116,000 sq. ft. of development.",
                sponsorId: sponsor
            });

            Property.create({
                name: "The Residences at 4100",
                location: "Washington, DC",
                picture: "/images/img_sponsor_project_1.jpg",
                description: "The Residences is a six story, 72 unit, apartment building with approximately 10,000 square feet of retail space. NDC acquired the land in 2008 and took the project through the Planned Unit Development (PUD) process to increase the amount of buildable square feet. After successfully completing the process NDC developed the property and placed the building into service in 2009.",
                sponsorId: sponsor
            });

            Property.create({
                name: "City Vista",
                location: "Washington, DC",
                picture: "/images/img_sponsor_project_2.jpg",
                description: "NDC served as a Joint Venture partner and co-General Contractor on this 685 unit, $200 million development led by Lowe Enterprises and CIM Group. CityVista included over 115,000 square feet of retail space and a mix of rental and for sale housing. The project began as a District RFP and was placed into service in 2007.",
                sponsorId: sponsor
            });

        });

        Sponsor.create({
            name: "Coastline Capital Partners, Coastline Real Estate",
            description:"Sea bream muskellunge, warbonnet mustache triggerfish, 'redtooth triggerfish convict cichlid threadfin bream loweye catfish.' Darter tubeshoulder spearfish brook lamprey longfin escolar needlefish flatfish pearleye sea toad sandburrower oceanic whitetip shark. Dab whalefish, Atlantic saury Asian carps pickerel, requiem shark smalleye squaretail: basslet. Bocaccio; knifejaw anemonefish Sundaland noodlefish chub northern lampfish, smelt rudderfish.",
            location: "El Segundo, CA",
            url:"coastlinerea.com",
            type: "Residential",
            numberOfDeals: "25",
            sectionHeading:"Featured Properties",
            option0Name: "Under Management",
            option0Value: "231 Million",
            option1Name: "Developed",
            option1Value: "90,000"
        });

        Sponsor.create({
            name: "Build Urban LLC",
            description: "Fruitcake lollipop unerdwear.com apple pie marshmallow pudding pudding macaroon. Gummies wafer toffee tiramisu danish cupcake marzipan. Ice cream powder sugar plum oat cake gummies sesame snaps. Cookie macaroon oat cake candy oat cake.",
            location: "Seattle, WA",
            url:"buildurban.com",
            type: "Retail",
            numberOfDeals: "124",
            sectionHeading:"Featured Properties",
            option0Name: "Under Management",
            option0Value: "150 Million",
            option1Name: "Developed",
            option1Value: "112,000"
        });

        Sponsor.create({
            name: "City Center Realty Partners",
            description:"Lorizzle izzle yo sizzle amizzle, that’s the shizzle adipiscing elit. Nullizzle velizzle, hizzle volutpizzle, suscipizzle quis, gravida vizzle, check it out. Pellentesque da bomb tortizzle. Sizzle eros. Gangster izzle dolor dapibus turpis tempizzle away.",
            location: "San Francisco, CA",
            url:"ccrpllc.com",
            type: "Multi Purpose",
            numberOfDeals: "65",
            sectionHeading:"Featured Properties",
            option0Name: "Under Management",
            option0Value: "800 Million",
            option1Name: "Developed",
            option1Value: "10,000"
        });
    });

});

//
// Add dummy deal data
//
Deal.find().remove(function() {
    Deal.create({
        name: "Haverly at Stone Mountain"
    });
});

//
// Clear out investments
//
Investment.find({}).remove();