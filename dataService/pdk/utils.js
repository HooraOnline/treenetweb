
export const mobileReg = /^09[0-9]{9}$/i;
export const digitReg = /^-?\d+\.?\d*$/;
export function  random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
//for hash string by public & private key
export const cipher = function (salt) {
  let textToChars = text => text.split('').map(c => c.charCodeAt(0))
  let byteHex = n => ("0" + Number(n).toString(16)).substr(-2)
  let applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code)

  return text => text.split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('')
}

export const decipher = function (salt) {
  let textToChars = text => text.split('').map(c => c.charCodeAt(0))
  let saltChars = textToChars(salt)
  let applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code)
  return encoded => encoded.match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('')
}
export function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof (obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof (obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};




