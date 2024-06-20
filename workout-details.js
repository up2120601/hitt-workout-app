

const allData = [
    {name: "Cooldown", description: "Take a moment to take deep breaths and regain your strength", piclink: "/images/cooldown-picture.gif"},
    {name: "Jumping jacks", description: "Jumping jacks target your glutes, quadriceps, hip flexors, and calves", piclink: "/images/workout1/show-pic.gif"},
    {name: "Squats", description: "A squat is a strength exercise in which the trainee lowers their hips from a standing position and then stands back up. It targets the lower back and core, as well as the quadriceps, hamstrings and glutes", piclink: "/images/workout2/show-pic.gif"},
    {name: "Press ups", description: "Press ups are where you lay with your belly to the ground, and feet on the ground, with your arms pushing you up, and you go from full extention of your arms to the ground, and back. It targets your shoulders, bicept and chest.", piclink: "/images/workout3/show-pic.gif"},
    {name: "Burpees", description: "A burpee is essentially a two-part exercise: a pushup followed by a leap in the air", piclink: "/images/workout4/show-pic.gif"},
    {name: "High Knees", description: "A cardio exercise that engages your core, increases your heart rate, and boosts your metabolism. Run in place while lifting your knees as high as possible.", piclink: "/images/workout5/show-pic.gif"},
    {name: "Mountain Climbers", description: "A full body exercise that combines the benefits of a plank with the challenge of moving your legs. In a plank position, alternate driving your knees towards your chest.", piclink: "/images/workout6/show-pic.webp"},
    {name: "Lunges", description: "A lower body exercise that targets the quadriceps and the glutes. Step forward with one leg, lower your body until your front knee is at a 90-degree angle, then push back up to the starting position.", piclink: "/images/workout7/show-pic.gif"},
    {name: "Plank", description: "A core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time. It targets the abs, back, and shoulders.", piclink: "/images/workout8/show-pic.gif"},
    {name: "Sit Ups", description: "An abdominal endurance training exercise to strengthen and tone the abdominal muscles. Lie down on your back, bend your legs and lift your torso towards your knees.", piclink: "/images/workout9/show-pic.gif"},
    {name: "Tuck Jumps", description: "A high-intensity exercise that targets your lower body and core. Stand with your feet shoulder-width apart, jump as high as you can and bring your knees to your chest in mid-air.", piclink: "/images/workout10/show-pic.gif"},
    {name: "Russian Twists", description: "A core exercise that improves oblique strength and definition. Sit on your sit bones as you lift your feet from the floor, lean back to engage the abs and twist your torso from side to side.", piclink: "/images/workout11/show-pic.gif"},
    {name: "Bicycle Crunches", description: "An abdominal exercise that targets the abs, hips and thighs. Lie down with your hands behind your head, bring your knees to your chest and alternate touching your elbows to the opposite knees.", piclink: "/images/workout12/show-pic.gif"},
    {name: "Box Jumps", description: "A plyometric exercise that targets your legs and core. Stand in front of a sturdy box or step, jump onto it, landing with your feet flat and knees soft, then jump or step back down.", piclink: "/images/workout13/show-pic.gif"},

]



function getData(mode, number) {
    if (mode == 1) {
        var index = number;
        return allData[index];

    } else if (mode == 2) {
        toReturn = [];
        for (let i = 0; i < allData.length; i++) {
            var wName = allData[i].name;
            toReturn.push({
                index: i,
                name: wName,
            })
        }
        return toReturn;

    } else if (mode == 4) {
        var toReturn = [];

        for (let i=0; i < allData.length; i++) {
            var toAdd = {name: allData[i].name, description: allData[i].description, link: allData[i].piclink}
            toReturn.push(toAdd);
        }
        return toReturn;
    } else if (mode == 5) {
        var toReturn = {name: allData[number].name, description: allData[number].description, link: allData[number].piclink}
        return toReturn;
    } else if (mode == 6) {
        var toReturn = allData[number].name;
        return toReturn;
    }

}


module.exports = {
    getData,
}