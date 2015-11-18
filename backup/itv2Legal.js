var itvSIte = {
    'controller': {
        getRequest: function (strURL, strTYPE, arrDATA, hndAFTERREQUEST) {
            $.getJSON(strURL, hndAFTERREQUEST);
        }
    },
    getController: function () {
        return this.controller;
    },
    run: function (strMode, login, pass) {
        switch (strMode) {
            case 'payments':
                this.getController().getRequest('http://api.itv.by/newxmlLegal.php?request=GetPrice&format=json', 'GET', '', this.parsePayment);
                break;
            case 'login':
                this.getController().getRequest('http://api.itv.by/xml.php?request=GetAccess&format=json&usrLogin=' + login + '&usrPass=' + pass, 'GET', '', this.parseLogin);
                break;
            case 'index':
            default:
                this.getController().getRequest('http://api.itv.by/newxmlLegal.php?request=GetAll&format=json', 'GET', '', this.parseResult);
                break;
        }
    },
    parseResult: function (data) {
        $('#owl-premiera-wrapper').html('');
        for (var intA = 0; intA < data['ALL']['PROMO'].length; intA++) {
            var strTemplate = '<div><div class="owl-title-background"><h2>' + data['ALL']['PROMO'][intA]['TITLE'] + '</h2> ' + data['ALL']['PROMO'][intA]['DESCRIPTION'] + '</div><!--div class="owl-title"><h2>' + data['ALL']['PROMO'][intA]['TITLE'] + '</h2> ' + data['ALL']['PROMO'][intA]['DESCRIPTION'] + '</div--><a href="' + data['ALL']['PROMO'][intA]['URL'] + '"><img src="' + data['ALL']['PROMO'][intA]['IMAGE'] + '" style="width: 100%;"></a></div>';
            $('#owl-premiera-wrapper').append(strTemplate);
        }

        $("#owl-premiera-wrapper").owlCarousel({
            items: $('#owl-wrapper img').length,
            navigation: true,
            paginationSpeed: 1000,
            singleItem: true,
            autoHeight: true
        });

        $('#owl-ether-wrapper').html('');
        for (var intA = 0; intA < data['ALL']['EPG'].length; intA++) {
            var strTemplate = '';
            data['ALL']['EPG'][intA]['START_TIME'] = data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 5);
            data['ALL']['EPG'][intA]['END_TIME'] = data['ALL']['EPG'][intA]['END_TIME'].toString().substring(0, 5);

            var intHours = (Number(data['ALL']['EPG'][intA]['END_TIME'].toString().substring(0, 2)) >= Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2))) ? Number(data['ALL']['EPG'][intA]['END_TIME'].toString().substring(0, 2)) - Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2)) : Number(data['ALL']['EPG'][intA]['END_TIME'].toString().substring(0, 2)) + 24 - Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2));
            var intMinutesAll = (Number(data['ALL']['EPG'][intA]['END_TIME'].toString().substring(0, 2)) == Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2))) ? Number(data['ALL']['EPG'][intA]['END_TIME'].toString().substring(3, 5)) - Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(3, 5)) : Number(data['ALL']['EPG'][intA]['END_TIME'].toString().substring(3, 5)) + 60 - Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(3, 5));
            intMinutesAll = (Number(data['ALL']['EPG'][intA]['END_TIME'].toString().substring(0, 2)) != Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2)) && data['ALL']['EPG'][intA]['START_TIME'].toString().substring(3, 5) == '00') ? intMinutesAll - 60 : intMinutesAll;
            intMinutesAll = intMinutesAll + intHours * 60;

            var curDate = new Date();
            var intHours = (Number(curDate.getHours()) >= Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2))) ? Number(curDate.getHours()) - Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2)) : Number(curDate.getHours()) + 24 - Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2));
            var intMinutesCur = (Number(curDate.getHours()) == Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2))) ? Number(curDate.getMinutes()) - Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(3, 5)) : Number(curDate.getMinutes()) + 60 - Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(3, 5));
            intMinutesCur = (Number(curDate.getHours()) != Number(data['ALL']['EPG'][intA]['START_TIME'].toString().substring(0, 2)) && data['ALL']['EPG'][intA]['START_TIME'].toString().substring(3, 5) == '00') ? intMinutesCur - 60 : intMinutesCur;
            intMinutesCur = intMinutesCur + intHours * 60;

            strTemplate += '<div class="owl-item"><div class="owl-item-wrapper" style="height: 250px;">';


            strTemplate += '<div class="owl-image"><div><div class="channel"><img src="' + data['ALL']['EPG'][intA]['ICONS'] + '" height="45"></div><a href="' + data['ALL']['EPG'][intA]['URL'] + '"> <img src="' + data['ALL']['EPG'][intA]['IMAGE'] + '" </a></div></div>';

            /*			strTemplate += '<div class="owl-image"><div><div class="channel"><img src="'+data['ALL']['EPG'][intA]['ICONS']+'" height="45"></div><img src="'+data['/*ALL']['EPG'][intA]['IMAGE']+'"></div></div>';*/


            strTemplate += '<div class="owl-channel">' + data['ALL']['EPG'][intA]['TITLE'] + '</div>';
            strTemplate += '<div class="owl-time"><div style="width: ' + (parseInt(intMinutesCur * 100 / intMinutesAll)) + '%"></div></div>';
            strTemplate += '<div class="owl-info">' + data['ALL']['EPG'][intA]['START_TIME'] + '-' + data['ALL']['EPG'][intA]['END_TIME'] + ' <b>' + data['ALL']['EPG'][intA]['TEXT'] + '</b></div>';
            strTemplate += '</div></div>';

            $('#owl-ether-wrapper').append(strTemplate);
        }
        $("#owl-ether-wrapper").owlCarousel({
            navigation: true,
            paginationSpeed: 1000,
            singleItem: false,
            autoHeight: true,
        });
    },
    //пакеты
    parsePayment: function (data) {
        console.log(data['PACKET']);
        window.ALLDATA = data['PACKET'];
        $('.paymentPrices').html('');
        for (var intA = 0; intA < data['PACKET'].length; intA++) {
            var strTemplate = '';
            strTemplate += '<div class="col-md-4 packetBody">';
            strTemplate += '<div class="packetWrapper" style="border:1px solid ' + data['PACKET'][intA]['INFO']['COLOR'] + '">';

            if (data['PACKET'][intA]['INFO']['ADVERT_URL']) {
                strTemplate += '<div style="position: absolute; bottom: 96px; left: 285px; z-index: 99; ">';
                strTemplate += '<img src="http://86.57.251.95/images/promo_icon.png">';
                strTemplate += '</div>';
            }

            strTemplate += '<div class="packetHader" style="background-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">' + data['PACKET'][intA]['INFO']['TITLE'] + '</div>';
            strTemplate += '<div class="row" style="margin-left: 7px;">';

            //моя вставка


            //здесь следует вставить текст о цене
            strTemplate += '<div class="col-md-61" style="padding-left:7px; padding-right:7px; width: 20%;">';

            strTemplate += '<div class="packetDevice" style="background-color: ' + data['PACKET'][intA]['INFO']['L_COLOR'] + '"></div>';
            strTemplate += '<div class="packetDeviceText" style="color: ' + data['PACKET'][intA]['INFO']['L_COLOR'] + '">УСТРОЙСТВА:</div>';

            strTemplate += '<div class="row">';

            for (var intB = 0; intB < data['PACKET'][intA]['DEVICE'].length; intB++) {

                strTemplate += '<div class="col-md-12" style="margin-bottom:10px;">';

                //вставка цены


                if (data['PACKET'][intA]['DEVICE'][intB]['STATUS'] == '1') {

                    strTemplate += '<div class="packetCheckboxActive" style="background-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"></div>';
                    strTemplate += '<div class="packetCheckboxTitle" style="width:240px; color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">' +
                        data['PACKET'][intB]['DEVICE'][intB]['TITLE'] + '</div>';


                } else {
                    strTemplate += '		<div class="packetCheckbox" style="background-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"></div>';
                    strTemplate += '		<div class="packetCheckboxTitle" style="color: #BFBABA">' + data['PACKET'][intB]['DEVICE'][intB]['TITLE'] + '</div>';
                }
                strTemplate += '		</div>';
            }


            for (var intB = 0; intB < data['PACKET'][intA]['PRICE'].length; intB++) {


                //вывод цен
                //strTemplate +=  data['PACKET'][intA]['PRICE'][intB]['PERIOD'] + ' ' + data['PACKET'][intA]['PRICE'][intB]['COST']; //рабочий без стиля

                strTemplate += '<div  class="list-inline" style="float: left;  font-size: 25px; padding-top: 10px;"> ' +
                    '<p style="color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"> ' + data['PACKET'][intA]['PRICE'][intB]['PERIOD'] + ': ' + data['PACKET'][intA]['PRICE'][intB]['COST'] + '</p></div>';
            }


            strTemplate += '		</div>';
            strTemplate += '	</div>';


            strTemplate += '	<div class="col-md-62" style="width: 13%; ">';
            strTemplate += '		<div class="packetContent" style="background-color: ' + data['PACKET'][intA]['INFO']['L_COLOR'] + '"></div>';
            strTemplate += '		<div class="packetDeviceText" style="color: ' + data['PACKET'][intA]['INFO']['L_COLOR'] + '">КОНТЕНТ:</div>';

            //моя вставка инпутов реквизитов


            strTemplate += '<div class="row">';


            for (var intB = 0; intB < data['PACKET'][intA]['CONTENT'].length; intB++) {
                strTemplate += '		<div class="col-md-12" style="margin-bottom:10px;  ">';
                if (data['PACKET'][intA]['CONTENT'][intB]['STATUS'] == '1') {
                    strTemplate += '		<div class="packetCheckboxRoundActive" style="background-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"></div>';
                    strTemplate += '		<div class="packetCheckboxTitle" style="width:150px; color: ' + data['PACKET'][intA]['INFO']['COLOR'] + ';">' + data['PACKET'][intB]['CONTENT'][intB]['TITLE'] + '</div>';
                } else {
                    strTemplate += '		<div class="packetCheckboxRound" style="background-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"></div>';
                    strTemplate += '		<div class="packetCheckboxTitle" style=" width:190px; color: #BFBABA">' + data['PACKET'][intB]['CONTENT'][intB]['TITLE'] + '</div>';
                }
                strTemplate += '		</div>';
            }


            strTemplate += '		</div>';

            strTemplate += '<div class="divAllCompany">';
            strTemplate += '<div class="divForCompany ">' +

                '<label class="labelCompany" for="nameCompany">Название организации</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '" type="text" name="inputForCompany">' +
                '<label class="labelCompany" for="nameCompany">Город/регион</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"  type="text" name="inputForCompany">' +
                '<label class="labelCompany"  for="nameCompany">Почтовый адрес</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"  type="text" name="inputForCompany">' +
                '<label class="labelCompany" for="nameCompany">Юридический адрес</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"  type="text" name="inputForCompany">' + '</div>';


            strTemplate += '<div class="divForCompany2">' +

                '<label class="labelCompany" for="nameCompany">УНП</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"  type="text" name="inputForCompany">' +
                '<label class="labelCompany" for="nameCompany">ФИО руководителя, должность</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"  type="text" name="inputForCompany">' +
                '<label class="labelCompany" for="nameCompany">Действует на основании</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"  type="text" name="inputForCompany">' +
                '<label class="labelCompany" for="nameCompany">Контактное лицо (ФИО, телефон)</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"  type="text" name="inputForCompany">' + '</div>';


            strTemplate += '<div class="divForCompany3">' +

                '<label class="labelCompany" for="nameCompany">E-mail</label>' +
                '<input class="inputCompany" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"  type="text" name="inputForCompany">' +
                '<label class="labelCompany" for="nameCompany">Реквизиты банка</label>' +
                '<textarea class="inputCompanyBank" style="border-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"   name="inputForCompany"></textarea>'
                + '</div>';

            strTemplate += '</div>';


            strTemplate += '	</div>';
            strTemplate += '</div> ';

            if (data['PACKET'][intA]['INFO']['ADVERT_URL']) {
                if (data['PACKET'][intA]['PRICE'].length == 0) {
                    strTemplate += '<div class="row">';
                    strTemplate += '	<div class="col-md-1"></div>';
                    strTemplate += '	<div class="col-md-6 packetPrice" style=" color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">';
                    strTemplate += '	</div>';
                    strTemplate += '	<div class="col-md-3"></div>';
                    strTemplate += '</div>';
                }
                if (data['PACKET'][intA]['PRICE'].length == 1) {
                    strTemplate += '<div class="row">';
                    strTemplate += '	<div class="col-md-1"></div>';
                    strTemplate += '	<div class="col-md-6 packetPrice" style=" float:right; line-height: 37px; color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">';
                    strTemplate += '	' + data['PACKET'][intA]['PRICE'][0]['PERIOD'] + ' ' + data['PACKET'][intA]['PRICE'][0]['COST'] + ' руб.';
                    strTemplate += '	</div>';
                    strTemplate += '	<div class="col-md-3"></div>';
                    strTemplate += '</div>';
                }
                if (data['PACKET'][intA]['PRICE'].length > 1) {
                    strTemplate += '<div class="row">';
                    strTemplate += '	<div class="col-md-1" style="padding-right: 20px;"></div>';

                    strTemplate += '	<div class="col-md-6 packetPrice" style="float:right; padding-left:278px; color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">';

                    strTemplate += ' <label class="priceList" style="border: 1px solid ' + data['PACKET'][intA]['INFO']['COLOR'] + '">' +
                        '<label onclick="$($(\'#priceList' + intA + '\').get(0)).trigger(\'mousedown\');" style="background-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '"></label>' +
                        '<select class="priceList" id="Select' + intA + '" name="priceList' + intA + '">';

                    for (var intB = 0; intB < data['PACKET'][intA]['PRICE'].length; intB++) {
                        strTemplate += '<option>' + data['PACKET'][intA]['PRICE'][intB]['PERIOD'] + ' ' + data['PACKET'][intA]['PRICE'][intB]['COST'] + ' руб.</option>';
                    }

                    strTemplate += ' </select></label>';

                    strTemplate += '	</div>';
                    strTemplate += '	<div class="col-md-3"></div>';
                    strTemplate += '</div>';
                }
                strTemplate += '<div class="row">';
                strTemplate += '	<div class="col-md-1"></div>';

                strTemplate += '	<button class="btn btn-default btn-from-js" id="' + intA + '" onclick="CheckButtonClick(this)" onmouseenter="mouseenter(this)" onmouseleave="mouseleave(this)" style="' + ' border: 1px solid ' + data['PACKET'][intA]['INFO']['COLOR'] + ' ; color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '; background-color:black;">Сформировать счет</button>';
                strTemplate += '	<div class="col-md-6" style="padding-left:350px; padding-right:30px; float: right">';



                strTemplate += '	</div>';
                strTemplate += '	<div class="col-md-3"></div>';
                strTemplate += '</div>';
            } else {
                if (data['PACKET'][intA]['PRICE'].length == 0) {
                    strTemplate += '<div class="row">';
                    strTemplate += '	<div class="col-md-3"></div>';
                    strTemplate += '	<div class="col-md-6 packetPrice" style="color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">';
                    strTemplate += '	</div>';
                    strTemplate += '	<div class="col-md-3"></div>';
                    strTemplate += '</div>';
                }
                if (data['PACKET'][intA]['PRICE'].length == 1) {
                    strTemplate += '<div class="row">';
                    strTemplate += '	<div class="col-md-3 "></div>';
                    strTemplate += '	<div class="col-md-6 packetPrice" style="line-height: 37px; color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">';
                    strTemplate += '	' + data['PACKET'][intA]['PRICE'][0]['PERIOD'] + ' ' + data['PACKET'][intA]['PRICE'][0]['COST'] + ' руб.';
                    strTemplate += '	</div>';
                    strTemplate += '	<div class="col-md-3"></div>';
                    strTemplate += '</div>';
                }
                if (data['PACKET'][intA]['PRICE'].length > 1) {
                    strTemplate += '<div class="row">';
                    strTemplate += '	<div class="col-md-3 col-xs-4"></div>';
                    strTemplate += '	<div class="col-md-6 col-xs-4 packetPrice" style="color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">';

                    strTemplate += ' <label class="priceList" style="border: 1px solid ' + data['PACKET'][intA]['INFO']['COLOR'] + '">' +
                        '<label onclick="$($(\'#priceList' + intA + '\').get(0)).trigger(\'mousedown\');" style="background-color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '">' +
                        '</label>' +
                        '<select class="priceList" id="Select' + intA + '" name="priceList' + intA + '">';

                    for (var intB = 0; intB < data['PACKET'][intA]['PRICE'].length; intB++)

                    {
                        strTemplate += '<option>' + data['PACKET'][intA]['PRICE'][intB]['PERIOD'] + ' ' + data['PACKET'][intA]['PRICE'][intB]['COST'] + ' руб.</option>';
                    }
                    strTemplate += ' </select></div>';



                    strTemplate += '	<div class="col-md-3"></div>';
                    strTemplate += '</div>';
                }
                strTemplate += '<div class="row">';
                strTemplate += '	<div class="col-md-2"></div>';

                strTemplate += '	<button class="btn btn-default btn-from-js" id="' + intA + '" onclick="CheckButtonClick(this)" onmouseenter="mouseenter(this)" onmouseleave="mouseleave(this)" style="' + ' border: 1px solid ' + data['PACKET'][intA]['INFO']['COLOR'] + ' ; color: ' + data['PACKET'][intA]['INFO']['COLOR'] + '; background-color:black;">Сформировать счет</button>';

                strTemplate += '	<div class="col-md-6">';

                strTemplate += '	</div>';
                strTemplate += '	<div class="col-md-3"></div>';
                strTemplate += '</div>';
            }
            strTemplate += '</div>';
            $('.paymentPrices').append(strTemplate);
        }
        ;
    },
    parseLogin: function (data) {
        alert(data['USER']['MSG']);
        if (data['USER']['MSG'] == "OK") {
            LoginGoodBad(true);
        }


    },
    CheckButtonClickIn: function (id) {
        if (ALLDATA[id]['PRICE'].length == 1) {
            location.href = ALLDATA[id]['PRICE'][0]['REAL_ID'];
        } else {
            k = $('#Select' + id + ' :selected').text();
            for (i = 0; i < ALLDATA[id]['PRICE'].length; i++) {
                rez = ALLDATA[id]['PRICE'][i]['PERIOD'] + ' ' + ALLDATA[id]['PRICE'][i]['COST'] + ' руб.';
                if (rez == k) {
                    location.href = ALLDATA[id]['PRICE'][i]['REAL_ID'];
                }
            }
        }
    }
};