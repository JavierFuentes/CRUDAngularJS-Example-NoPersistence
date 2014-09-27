/**
 * Created by Javi on 15/06/14.
 */

//----------------------------------------------------------------------------------------
// DEFINO UNA CLASE PARA PODER REUTILIZAR SUS MIEMBROS EN CUALQUIER SITIO
//----------------------------------------------------------------------------------------

// Constructor
/**
 * Clase Contact para tratar en la Vista los datos que lleguen del Modelo
 * @param Obj
 * Objeto con la siguiente estructura: {"id":  [optional], "firstName": "Nombre1",  "lastName": "Apellido1",  "birthday": "01021971", "sex": 1,    "city": "ciudad1",  "blocked": false, "balanceAmount":  100.0}
 * @constructor
 */
function ContactObj(Obj) {

    // PK
    if (Obj["id"]) {
        this.id = Obj["id"];
    } else {
        this.id = Math.random() * 1000000;
    }

    if (Obj["firstName"]) {
        this.firstName = Obj["firstName"];
    } else {
        this.firstName = null;
    }

    if (Obj["lastName"]) {
        this.lastName = Obj["lastName"];
    } else {
        this.lastName = null;
    }

    if (Obj["birthday"]) {
        this.birthday = Obj["birthday"];
    } else {
        this.birthday = null;
    }

    if (Obj["sex"]) {
        this.sex = Obj["sex"];
    } else {
        this.sex = null;
    }

    if (Obj["city"]) {
        this.city = Obj["city"];
    } else {
        this.city = null;
    }

    if (Obj["blocked"]) {
        this.blocked = Obj["blocked"];
    } else {
        this.blocked = null;
    }

    if (Obj["balanceAmount"]) {
        this.balanceAmount = Obj["balanceAmount"];
    } else {
        this.balanceAmount = null;
    }
}

//***********************************************************************
// Resto de Métodos
//***********************************************************************

//=======================================================================
// Métodos para devolver el Label de cada campo
//=======================================================================

ContactObj.prototype.getIdLabel = function () {
    return "Id";
};

ContactObj.prototype.getFirstNameLabel = function () {
    return "Nombre";
};

ContactObj.prototype.getLastNameLabel = function () {
    return "Apellidos";
};

ContactObj.prototype.getFullNameLabel = function () {
    return "Apellidos, Nombre";
};

ContactObj.prototype.getBirthLabel = function () {
    return "Fecha Nacimiento";
};

ContactObj.prototype.getAgeLabel = function () {
    return "Edad";
};

ContactObj.prototype.getSexLabel = function () {
    return "Sexo";
};

ContactObj.prototype.getCityLabel = function () {
    return "Ciudad";
};

ContactObj.prototype.getBlockedLabel = function () {
    return "Bloqueado";
};

ContactObj.prototype.getBalanceAmountLabel = function () {
    return "Saldo (Euros)";
};

//=======================================================================
// Getters y Setters
//=======================================================================

ContactObj.prototype.getId = function () {
    if (!this.id) {
        return "N/D";
    }

    return this.id;

};

ContactObj.prototype.getFullName = function () {
    if (!this.firstName) {
        this.firstName = "";
    }

    if (!this.lastName) {
        this.lastName = "";
    }

    if (this.lastName && this.firstName) {
        return this.lastName + ', ' + this.firstName;
    } else {
        return this.lastName + this.firstName;
    }
};

ContactObj.prototype.getBirth = function () {
    if (!this.birthday) {
        return "N/D";
    }

    var birthYear = Date.parseExact(this.birthday, "ddMMyyyy");
    if (!birthYear) {
        return "N/D";
    }

    birthYear = birthYear.toLocaleDateString();

    return birthYear;
};

ContactObj.prototype.getAge = function () {
    if (!this.birthday) {
        return "N/D";
    }

    var birthYear = Date.parseExact(this.birthday, "ddMMyyyy");
    if (!birthYear) {
        return "N/D";
    }

    var today = new Date();
    var age = (today - birthYear) / (1000 * 60 * 60 * 24 * 365)
    age = age.toPrecision(2);

    return age;
};

ContactObj.prototype.getSex = function () {
    /*
     if (this.sex === 1) {
     return "Hombre";
     }
     else if (this.sex === 2) {
     return "Mujer";
     }
     else {
     return "N/D";
     }
     */

    if (!this.sex) {
        return(0);
    }

    return this.sex;
};

ContactObj.prototype.getSexToString = function () {

    if (this.sex === 1) {
        return "Hombre";
    }
    else if (this.sex === 2) {
        return "Mujer";
    }
    else {
        return "N/D";
    }
};

ContactObj.prototype.getSexValueList = function () {
    return [
        {value: 0, label: "N/D"},
        {value: 1, label: "Hombre"},
        {value: 2, label: "Mujer"}
    ]
};

ContactObj.prototype.getCity = function () {
    if (!this.city) {
        return "N/D";
    }

    return this.city;
};

ContactObj.prototype.getBlocked = function () {
    //return this.blocked === true ? "Si" : "No";

    return this.blocked;
};

ContactObj.prototype.getBlockedValueList = function () {
    return [
        {value: false, label: "No"},
        {value: true, label: "Si"}
    ]
};

ContactObj.prototype.getBalanceAmount = function () {
    if (!this.balanceAmount) {
        return "N/D";
    }

    return this.balanceAmount.toFixed(2);
}
