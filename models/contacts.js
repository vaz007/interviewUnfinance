
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
      },
      email: {
        type: String,
        required: [true, "please add an email"],
        unique: true,
        match: [
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please enter a valid email",
        ],
      },
      phone: {
        type:String,
        required:[true, "please add a phone"],
        unique: true,
        match: [
            /^((\\+91-?)|0)?[0-9]{10}/,
            "Please enter a valid number"
        ]
      },
      linkedInProfile : {
        type:String,
        unique:true,
        match: [/^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/,
                'Please enter a valid linkedin url'
    ]
      }    
});
module.exports = mongoose.model("Contact", ContactSchema);