var imgBase64 = 'data:image/png;base64,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';
var imgBase64Hover = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABOCAYAAACOqiAdAAAABHNCSVQICAgIfAhkiAAAER5JREFUeF7tnAt4FEW2x091z+RFHoRESELYgBcJyCp4hYC4CisuAkoEFBTB8JKAEXBxZQ26iigLQYzsyhJEXkkWFhQ3gbBXlkdUdpc37uUpBFwRCAmPBMiDvKfrfqd7KlPT6ZmumUzQ77vW9+WbYab6VNWv/ufUqeoeCPxUvCJAvLrqp4vgxwjOVZ/oj2m+fkhwvmr7BwHqq86LiMGoLf1nZv3RQzKCdltAmnVUBIhZHb4No/euvjeyy0Nh740+w2tbFGBLgnMFiX2Or+TO0RXDiGxNAElqR4C0BUruAELaApA7NHL0GlB6FQi9RoFeBUW5Qm31B7/7NGSrHQ4P0Aym2SQLf98S4PTAnEC1G7QnPLhNj6Eg+Q+TiDwICAQL95avSKFSobYdQGvzKkuPbruy48EbbkD6XIG+BOcOmNRpVHFP2T9yPiHyr7wCZXIRVWw76uuuv31+U7uvAUDhXBVV6Mqdve6Kr8DxqsLOqG4IANLPnjzb2Rrc8V0g8ghCWjb9oRQoAVtOXXXR3At/jTvLAdS7cLPjny/AObkigxabeDLOL6TzHEmyJgEBi9dT682FFBoUWpdVVXJq/uW/33eJc2Fefc2C11xwemgSgot79sbjFmtYJhAI9WbcPruGQnl9ffnkCxtb59nhMRc2WkQ8arY54Jg7MtdEaFKncdVvEMn/dy3tlqKjRPdVlNp5368LTLO7rrv4J2rWq5hj6Jqtey5p1ebelJVEsj4t3PptrEht9RtLz61OKftXSqUvXNdTxfH1VbdElUUN3hcT2C5hCyHk3tvIwuOmKKVHqq4fHnllax+Me0x5+MqKcNzzBhy7RnXN1j2XBIX3mL6bSHKzocVGArSP0MbQPhLgUon2/lIpQKH9vce0dBdQajt648ifBtw8MquKc12W57UIOB6YqjT865hUu57I1pHeDuhX9wHgX594gNhI1/NYWELhQAFAzh6A/QXetqZdpyj1n53P8n+eA6ePe6YNiCqOj2vMReW4pFuzJUvgO6atGFQY2Q9gZqJ7WK7sIsQP8wBy9nrTsh1eQ/Vb57NbLQYAm27FZepza9wTcI1JLSot7rlrT5OANtlEU55wiY0ASJtIoE9806ZPXaRwsACgvNphLjQQICEeoFuHpvUPFFBIXUuhsFS4eT6YKbbqkqcubmi3Tbfa6ncahsZFwDnFNIQW3C87LKLrcycJIZGedBlV9sZoAqFBjmYRVmY+hV1HAMox6rgooUEAj/YEeKofgYQujuvLqyj8/lPqnfoovVp1/tN7r+Y/d1PntqaqMwOnd1FUlxyXVDmfWANf8QjaAwBpExzivFRKITWTwoEznljR6vbpgrYItI9wdD81U4GcfZ7bovXVH5zPDv6d3WUx1gnFOxFwvIvKEcP2dgxu1+cIAPiLdnMkQhvvgLbrKIXULOqksIQuAN1iQVUTqosVVOHBMxROFeIr58JBaJPAoz04eFlewKNQc/Pi/9xdtiOxmIPH3NXlKusOnF5tMqrtZxOqPyYWv7Gi0Lp1APjzLId75u6j8FqW1h8ENP4RAiMeAIjl1OPKdmEphdx9AFlfOKAvGo/Xa11Ft31+CYVTF0V7p9VTGmrWXMxsNcMODhcLU9WZgXNSW3Tiv39ubdtjPyGAEIXK5jmkMbDn7qeQmq1BS/olwIzHneOdkEE7oAWfUcjdr12RlkRgRF9tKBgzhy8UTsfUaygFW13Z6X6XN3U/Jqo6V+D0OZuqtg6TarYQ2fqo6AARzPTHNVOnCzU1YFmY5Oxiovb09XL2UVj4GVVX4S2vE+gaq7U1J1uBHDtUUdvUVr/r4pqAJznVYWfZrqLJTLgD56S2oPuXhEf+98zvgYCfaGfy5zkC+Ig0Rd0BZL1MoJt9gKJ23NU7VUhh/B+puuPITdXiKLrso3M1oMKFQl3JNxmdqvbMuC6iOiNwhrEtZtylZ+SgqDWiHRnRF2DhOG0guQcozPkzhdxU30JjfUF4I9IoLHyewIg+dtWtUxpdWbTPtqrLk4rWtf8EABpcnKQ0mnIHTt1SoYsCgCV2clUWsfgLb62yZxLofZdmfvyHCiTcReClIWaLuOgQm9Zbto1C/jEKOa9pk4Xvp6/0MNbVV28oXBOcbAfHFglDd3UFjrmpGtsAIi0dpl0pxIVQZGiY7e9P0wZw+hKF19dTyPmtRxsMkWaa1Bn5ngILxhLo2l4bVt9UxUN3pcUXV0TFA5Sg4hAc24412U24A8fUJrcbc7qvNeyufNHRJPUHmDNSA5W9m0LXGFAV54uCE8HA6O0dPEvhdBFAUn9HenLwW4C0XAqXMHIJlPqyswOvbOiKSwsDpz81Vq24Ase7qRw98epMOaDNArN2UWlrX5Kgm33GVZc5TmHgPb6BhvbunmWDrJck6N3Z2ObmgwoMT3BWd3k1hUHviqnPVnP99eK1bT/UgePzOkNwzEXxFVvHmyyW6BduvidZg6eZgVswhjTptNk1nnyPkzBjjQLt2wDsfFM4lVSbSNusqOo3K0p9xR+KV4W/aQfHFokmOwn9tPEpCAMnR0+pyJKsgSPMGj2Z7tlgzOzpv5+51gb5J7RPf/8sgeG9xeNmxg4Flm0XAVe9oXhlyFSDBcIpzrkDZ18YwBIztepzIvs9aDbQEy0IbsshBd7Y6Bg4qm77G+ITheAyBMBRW92eohVBQzlw/BassQNm4FRXjXmx5jBIls6m4N4XH4iZLfZ90Q0KGTsobD7UVC0fTpDgkZ+LxU8V3A5zxYHS8G3R8oBednBsdW2yQBiBc1oYAMAanVJ/nhBimoocX9w8cAgJV8WCIqqmMQVFAJfwiRAX5cleBOY/I+auy3eKgaOUlhdnWOMAoJ5bIPi0pMniwO9PGxNfVFzUS2LgTrznGbgvTiIoCoe+0yB5tEXCpDIQYO88sTYzENxOc8UhuMvLVHCoNl5xTokwrzhX4KxRKTUHiYCrHl8kNghU1MvZils1ibry9lQJYsLN3XX5LkFwSsO3lzMCEuyKax64dim3/ibJ/v3MBnMsTQzckEU2n0DD/qxJlqDXnWLglu8yV5xiq917JaPVEz4B13Zq+RrJL2i4L8B9+Y2mNl+V+aMIJN5vHudQcULg6qo2X10ROslH4ErTJP8w3Py6LX8YJ8Ev73Y/+x/lK7A833zmzdpi3784kMC0gQ5wBcUU4qOd+1BRQ2H0UgWK3Cw0zJ5SW/bx1RURqb4AZ4mYfPk3llaReEPDbYkJB1j9gnPMWb9HgbEPOgaGivv1Ot8pTg9uyGIb9O6EMIka+xDkW58pcBrvKAiUhlsl80tXR6V7sjigWbbVatzgYzrSZuyRx6yR3TcKtAshAQC9OhF11vP+V5vlVZNl9TMsmHIMTcfV3TflnackSLxPm5jD5yi8sFqzPXuoBGP7SfBWjg3y/i2u8PqSk89eX99zuy4d0d/9arLJ57dc6jmc+hf3UNAdw/NPi+RyRjhQAasmORaOZzIahBVghnf1JMekvLDGBofOaZA+f0WG9uEEhqQ3QBHeNRUolNKKa5sHxsP5f+IdXn064vGWy4rwIlNurJb8gvFM3qsye4gEYx/QlIFKfCvXM3dFxSb2JE7Xobr/+br2sOf6fQos3qbZxLqrJspw+HsKCFO0KHWVW0oywifbofEJsNDOgXdXTXEAlvCJp0ZZW3f+SLQTRvU2vihDfJTmso8vcVZCfBTAq4NlyDuiOCmkV0cC6l8nAlPW2lQYrCDIeSNkKLhM4dnlDkArJ2gqfGWDDb487YGb3vx22o213TZxatMfoZvuVXF0jZt8BOd//4w2IQ9/8A0B8Zs1eniokJUTNXgYj6ZkOquBgTCCPjfXBnlHHBDQ1sZpMlTUggq0oka7yhVMswmnAHWVu2Z2qzm+HNde3k0NT4FFDjKZ6qyRM8o/JdbAAWadcPc9DnjekxIM6CrB+9tt8Jf9zoqIaQ0wtb8EMa21rqGa/nLAWYX4efozEoQGEHjlEwc0VO2GqRbA9CM5ywYFl8V7SuurvypZGjqaS0P0uwanjgodndvd1Ro8fOs9gXcO/lK8O65rIpwxfQmkb1dgK6ckEdt4bUUtdYKO0FaMlyEkAG02nRAzu9Xntg2ozE3E0z6Mbfw9B4+OzvVpSaPqIqZfX0n8QxLNOiLyPapvQDyBrUfF45CR3TEJRFUpQns7z+axPVpbkVf6pzZTTNQmpDjsn9PtQbZIBD626s6g7uP3evIYhAhEb+qgW88dJquLBxZvoAGltVVHMx+qyk8+p1sUvLo9iP1gqnNaJDAhDp9RsljyD8NHQX1ekh+W4LkEoqpn61EF0ncqjYGfNTagC4ExfSToFacBO3OFqtAKrnjeHVv1jVU3l7XFXRFzUSM3RcOmimPQWDKM4Bpv3CA4vwfeiQrpl3oICBF+1EtkSAjk/VHOJyxfFSjw9Xmqgrw/TvtjpbiMwsf/UGDrMe9cHRPeyn0L+tXtfRuR8+Awrrm8p8oAGY2JP5trkpogvLApZ563tO6Ez9D6rMx9QoIn7nV/0oGwEOTuMxS+OuMdMNbhhmsnkssy78Nf3RipzauHbsxUpy4WYSmFb8qt2qb4ilzyLySY8pCz4hDU344p8PUFqq6kZ7xwR6P+2W5dzSjLiH1XF9dYwutWbe4Ux3/X+JQ5e47E/mqFwAhreHLBR8Q/FA/+ml1C/AHWTbJAdJjDHWf/tQF2n22esvQdo7UVn9/4uEsyVJei0tjWSv/Yg8tHvMzA6VXHn5g0bsWgwyPBrUflbSEWv+7NJgcACK9/FwIh/gR2n1WgqMwXVh02lIa6U2WbEofBxS/wp0lsh+Aqb3M5Y2Znzux7o+OmRnjWAR/EBveetgUkS4xvh+lja7aG4srDSxPrv3oNHyByBc30MVYRxRmpzkh5MvzXY8Fhw9YtJgFhpkfsPsYhZI7WlG0u2zpuNvxnOyoNY5h+P8qfuTV5OknfiJniWH2WmhjtKBzndgBySMp3L0shsb/5Uf3ssqIovSKj4x8NgBntR02hiSqOr8fA8SkKnyCr70PGHxgsR/dcCoQECsmhpSpRWmErPjKrIqvP37mby3w845+BE3JRXkmi3eZVZxTzmPJUeNYH347275U8SwqKHE20M73bVii6YfX1TdWHl6XX/+tdPCNhgPTQjNxTaAkXdVW9y+K/2V6Wj3lMfexVChi8vLO1+9OvEr+woS3tvvhraKgt21Z34pNFNTumf2d/jpdB078yaHzaIQTNE1c1UijL79wBZFCloKc39ZA7DnxV8gvu3xLSU+oq/1F3dtui2i1jj3PA2NaJh8YD43cH2K0WA6ePd7z7sj1tIyzuFNkB954JrVv1nf6IFBY3iPiF9gdCWnkFktJbtK58t3Lzws5bB5bmw/FM/Q/Z+EdR+ZMO/a6AwRKG5o3i+DEyaMwOrzz+SIoHyT5vXGSCJuwZJIW27wmWwDuAyJFE9osAWY4AYtF+K00bSsFmK6W2ulKgthJoqL5Kyy8cvpX5MB6oMsWwV6YmBooHplcaU5hHwLxZHIyEwSfI/IprBFH/GV9fb8eoLT5NYO/539XzYIze85C9UpleNV55CneRftBMiXp18eD00HiXN/IEfqAMmhk8XoX6azyKZ+4U40t4bOB6OE3clPuvhJoDzshd9VD1CvPKPX2tOCO3N4p/+t2HPi/kgYu6qt799MCM4lizoTV3cXClUj431APUwzL63p36jeKc3g31bs3s+QSYrxYHd4PUA9QrSg9NZCKNXM4IFA/Jp8BuBzhXLqz/3AiwqwkxAuIKUosAu53g3LWl3/KZbQH1MIzgtCiwHwKcXkVmkERX+tsCqqU6LzpIkXqugP4ggERWQJFB/VTHTsBX7vL/Duj/AZGeC7jbdOpPAAAAAElFTkSuQmCC';
window.onload = function () {
    var div = document.createElement('div');
    // div.style = 'position: fixed;bottom: 25%;right:0';
    div.style.position = 'fixed';
    div.style.bottom = '25%';
    div.style.right = 0;
    div.style.zIndex = 1000;
    div.innerHTML = '<img id="kfImg" src="' + imgBase64 + '" onmouseover="changeImg(1);" onmouseout="changeImg(2);"/>';
    document.body.appendChild(div);
    div.addEventListener('click', function (e) {
        var ut = getCookie('ut');
        if(ut == ''){
            openCustomerService('', '', '备课端');
        }else{
            openCustomerService(ut, getCookie('username'), '备课端');
        }
    })

}

function changeImg(type){
    if(type == 1){
        //hover
        document.getElementById("kfImg").setAttribute("src",imgBase64Hover);
    }else {
        document.getElementById("kfImg").setAttribute("src",imgBase64);
    }
}

function includes(str, needle) {
    return str.indexOf(needle) !== -1;
};

/**浏览器 */
function browserName(user_agent, vendor, opera) {
    vendor = vendor || ''; // vendor is undefined for at least IE9
    if (opera || includes(user_agent, ' OPR/')) {
        if (includes(user_agent, 'Mini')) {
            return 'Opera Mini';
        }
        return 'Opera';
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
        return 'BlackBerry';
    } else if (includes(user_agent, 'IEMobile') || includes(user_agent, 'WPDesktop')) {
        return 'Internet Explorer Mobile';
    } else if (includes(user_agent, 'Edge')) {
        return 'Microsoft Edge';
    } else if (includes(user_agent, 'FBIOS')) {
        return 'Facebook Mobile';
    } else if (includes(user_agent, 'Chrome')) {
        return 'Chrome';
    } else if (includes(user_agent, 'CriOS')) {
        return 'Chrome iOS';
    } else if (includes(user_agent, 'UCWEB') || includes(user_agent, 'UCBrowser')) {
        return 'UC Browser';
    } else if (includes(user_agent, 'FxiOS')) {
        return 'Firefox iOS';
    } else if (includes(vendor, 'Apple')) {
        if (includes(user_agent, 'Mobile')) {
            return 'Mobile Safari';
        }
        return 'Safari';
    } else if (includes(user_agent, 'Android')) {
        return 'Android Mobile';
    } else if (includes(user_agent, 'Konqueror')) {
        return 'Konqueror';
    } else if (includes(user_agent, 'Firefox')) {
        return 'Firefox';
    } else if (includes(user_agent, 'MSIE') || includes(user_agent, 'Trident/')) {
        return 'Internet Explorer';
    } else if (includes(user_agent, 'Gecko')) {
        return 'Mozilla';
    } else {
        return '';
    }
}

/**
 * 获取客服打开窗口地址，并打开
 * @param teacherNumber
 * @param userType
 * @param platform
 * @param browser
 */
function openCustomerService(ut,teacherNumber, platform) {
    let browser = browserName(navigator.userAgent, navigator.vendor, window.opera);
    let params = {}
    // let obj = {}
    // obj.userId = teacherNumber;
    // obj.userType = userType;
    // obj.platform = platform;
    // params.extInfo = obj
    // params.userId = teacherNumber;
    // params.browser = browser;
    params.releamName = window.location.host;//域名
    params.ut = ut;//ut
    params.platName = platform;//平台
    params.username = teacherNumber;//教师账号


    $.ajax({
        url: 'https://icss.czbanbantong.com/icss/customer/baseinfo',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(params),
        success: function (data) {
            console.log(data);
            let openUrl = 'https://cschat.antcloud.com.cn/index.htm?tntInstId=SHZDJOWA&scene=SCE00025771&cinfo='+data.cinfo+'&key='+data.key;
            console.log(openUrl);
            window.open(openUrl);
        },
        error: function (e) {
            console.log(e);
        }
    })
}


/**浏览器版本 */
function browserVersion(userAgent, vendor, opera) {
    var br = browserName(userAgent, vendor, opera);
    var versionRegexs = {
        'Internet Explorer Mobile': /rv:(\d+(\.\d+)?)/,
        'Microsoft Edge': /Edge\/(\d+(\.\d+)?)/,
        'Chrome': /Chrome\/(\d+(\.\d+)?)/,
        'Chrome iOS': /CriOS\/(\d+(\.\d+)?)/,
        'UC Browser': /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
        'Safari': /Version\/(\d+(\.\d+)?)/,
        'Mobile Safari': /Version\/(\d+(\.\d+)?)/,
        'Opera': /(Opera|OPR)\/(\d+(\.\d+)?)/,
        'Firefox': /Firefox\/(\d+(\.\d+)?)/,
        'Firefox iOS': /FxiOS\/(\d+(\.\d+)?)/,
        'Konqueror': /Konqueror:(\d+(\.\d+)?)/,
        'BlackBerry': /BlackBerry (\d+(\.\d+)?)/,
        'Android Mobile': /android\s(\d+(\.\d+)?)/,
        'Internet Explorer': /(rv:|MSIE )(\d+(\.\d+)?)/,
        'Mozilla': /rv:(\d+(\.\d+)?)/
    };
    var regex = versionRegexs[br];
    if (regex === undefined) {
        return null;
    }
    var matches = userAgent.match(regex);
    if (!matches) {
        return null;
    }
    return parseFloat(matches[matches.length - 2]);
}

function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null && arr != "") return unescape(arr[2]);
    return "";
}