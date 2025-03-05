import { Schema, model} from "mongoose"

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        maxLength: [25, "El nombre no puede ecceder los 54 caracteres"]
    },
    surname: {
        type: String,
        required: [true, "El apodo el obligatorio"],
        maxLength: [25, "El apodo no peude ecceder los 25 caracteres"]
    },
    username: {
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: [true, "El Email es obligatorio "],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La Contraseña es obligatoria"]
    },
    profilePicture: {
        type: String
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "CLIENT"],
        default: "CLIENT", 
      },
        status: {
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timestamps: true
})


userSchema.methods.toJSON = function(){
    const { password, _id, ...usuario } = this.toObject()
    usuario.uid = _id
    return usuario
}

export default model("User", userSchema)