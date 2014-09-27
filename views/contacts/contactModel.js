/**
 * Created by Javi on 22/06/14.
 */

function Contact() {
    this.id = '';
    this.firstName = null;
    this.lastName = null;
    this.birthday = null;
    this.sex = null;
    this.city = null;
    this.blocked = null;
    this.balanceAmount = null;
}

Contact.prototype.getLabel = function (fieldName, markMandatory) {
    var mandatoryChar = '';
    if (markMandatory === true)
        mandatoryChar = ' *';

    switch (fieldName) {
        case 'row':
            return '#';

        case 'id':
            return 'Id';
        case 'firstName':
            return 'Nombre' + mandatoryChar;
        case 'lastName':
            return 'Apellidos' + mandatoryChar;
        case 'birthday':
            return 'Fecha Nac.' + mandatoryChar;
        case 'age':
            return 'Edad';
        case 'sex':
            return 'Sexo' + mandatoryChar;
        case 'city':
            return 'Ciudad' + mandatoryChar;
        case 'blocked':
            return 'Bloq.' + mandatoryChar;
        case 'balanceAmount':
            return 'Saldo';
        default :
            return 'N/D';
    }
};

Contact.prototype.getAge = function () {
    if (!this.birthday)
        return "N/D";

    var myDate = Date.parseExact(this.birthday, 'yyyy-MM-dd');

    if (myDate === null)
        return "N/D";

    //return Math.ceil((Date.today() - myDate) / (3600 * 1000 * 24 * 365));
    return (Date.today().getFullYear() - myDate.getFullYear());
};

Contact.prototype.fromServerToView = function (dbObj) {

    this.id = dbObj.id;
    this.firstName = dbObj.firstName;
    this.lastName = dbObj.lastName;

    this.birthday = myUtils.dmyTOymd(dbObj.birthday);

    this.sex = dbObj.sex;
    switch (dbObj.sex) {
        case 1 :
            this.sex = 'Hombre';
            break;
        case 2:
            this.sex = 'Mujer';
            break;
        default :
            this.sex = 'N/D';
            break;
    }

    this.city = dbObj.city;

    this.blocked = dbObj.blocked;
    switch (dbObj.blocked) {
        case false :
            this.blocked = 'No';
            break;
        case true :
            this.blocked = 'Si';
            break;
        default :
            this.blocked = 'N/D';
            break;
    }

    // Suponemos que nos llegan multiplicados por 100 lo importes
    // Esto también convierte a 0 los null que lleguen de la BD.
    this.balanceAmount = dbObj.balanceAmount / 100;

    return this;
};

Contact.prototype.fromViewToServer = function () {
    var dbObj = {};

    dbObj.id = this.id;
    dbObj.firstName = this.firstName;
    dbObj.lastName = this.lastName;

    dbObj.birthday = myUtils.ymdTOdmy(this.birthday);

    dbObj.sex = this.sex;
    switch (this.sex) {
        case 1 :
        case 'Hombre' :
            dbObj.sex = 1;
            break;
        case 2:
        case 'Mujer':
            dbObj.sex = 2;
            break;
        default :
            dbObj.sex = null;
            break;
    }

    dbObj.city = this.city;

    dbObj.blocked = this.blocked;
    switch (this.blocked) {
        case false :
        case 'No':
            dbObj.blocked = false;
            break;
        case true :
        case 'Si':
            dbObj.blocked = true;
            break;
        default :
            this.blocked = null;
            break;
    }

    // Suponemos que enviamos multiplicados por 100 lo importes
    // Esto también convierte a 0 los null que lleguen de la BD.
    dbObj.balanceAmount = Math.floor(this.balanceAmount * 100);

    return dbObj;
};

Contact.prototype.VerifyData = function () {
    // Control de errores en los datos al margen
    // de lo que se pueda controlar por HTML
    var fieldsList = [];

    if (!this.firstName)
        fieldsList.push('Nombre');

    if (!this.lastName)
        fieldsList.push('Apellidos');

    var myDate = Date.parseExact(this.birthday, 'yyyy-MM-dd');
    if ((!myDate) || (myDate > Date.today())) {
        fieldsList.push('Fecha Nacimiento');
    }

    if ((this.sex != 1) && (this.sex != 2) &&
        (this.sex != "Hombre") && (this.sex != "Mujer"))
        fieldsList.push('Sexo');

    if (!this.city)
        fieldsList.push('Ciudad');

    if ((this.blocked != 0) && (this.blocked != 1) &&
        (this.blocked != "No") && (this.blocked != "Si"))
        fieldsList.push('Bloqueado');

    if (isNaN(this.balanceAmount))
        fieldsList.push('Saldo');

    return fieldsList;
};