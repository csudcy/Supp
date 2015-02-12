function get_users() {
    return Rooms.findOne({
        _id: PersistentSession.get('room')
    }).users;
}

Template.scrum_master.helpers({
    room_users: function () {
        var users_ar = [];
        var users_obj = get_users();

        for(var key in users_obj){
            var user = {};

            user['name'] = key;
            user['vote'] = users_obj[key];

            users_ar.push(user);
        }

        return users_ar;
    },
    room_name: function () {
        return PersistentSession.get('room');
    },
    status_percentage: function () {
        var users_obj = get_users();
        var not_completed = 0;
        for(var key in users_obj){
            if (users_obj[key] === null){
                not_completed++;
            }
        }
        var result = (Object.keys(users_obj).length - not_completed) * 100 / Object.keys(users_obj).length;
        console.log(result);
        return result;
    }
});

Template.scrum_master.events({
    'click .reset_votes': function () {
        // insert a click record when the button is clicked
        var set = {};
        console.log("Reset!");
        Object.keys(get_users()).forEach(function(u){
            set['users.' + u] =  null;
        });

        //  update the user's value in the room
        Rooms.update(
            {
                '_id': PersistentSession.get('room'),
            },
            {
                $set: set
            }
        );
    },
    'click .clear_room': function () {
        Rooms.update(
            {
                '_id': PersistentSession.get('room'),
            },
            {}
        );
    }
});
