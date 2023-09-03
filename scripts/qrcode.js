
function makeURI() {
	var algorithm = document.getElementById("algorithm").value;
	var account = document.getElementById("account").value;
	var issuer = document.getElementById("issuer").value;
	var secret = document.getElementById("secret").value;
	var digits = document.getElementById("digits").value;
	var period = document.getElementById("period").value;
	var image = document.getElementById("image").value;
	var lock = document.getElementById("lock").checked;
	var type = document.querySelector('input[name="type"]:checked').value;
	var uri = "otpauth://" + type + "/";

	if (issuer.length > 0)
		uri += encodeURIComponent(issuer) + ":";

	uri += encodeURIComponent(account);
	uri += "?secret=" + secret;
	uri += "&algorithm=" + algorithm;
	uri += "&digits=" + digits;
	uri += "&period=" + period;
	uri += "&lock=" + lock;

	if (type == "hotp")
		uri += "&counter=0";

	if (image.length > 0)
		uri += "&image=" + encodeURIComponent(image);

	return uri;
}

function onImageError() {
	document.getElementById("image").classList.add("error");
	document.getElementById("preview").src = "img/error.svg";
}

function onValueChanged() {
	function check(element, valid) {
		var e = document.getElementById(element);
		var v = valid(e.value);
		e.classList.toggle("error", !v);
		return v;
	}

	var err = false;
	err |= !check("account", (v) => v.length > 0 && !v.match(/:/));
	err |= !check("secret", (v) => v.match(/^[a-z2-7]{26,}$/i));
	err |= !check("issuer", (v) => !v.match(/:/));

	var prv = document.getElementById("preview");
	var img = document.getElementById("image");
	var src = img.value.length > 0 ? img.value : "img/freeotp.svg";

	img.classList.remove("error");
	prv.src = err ? "img/error.svg" : src;

	var uri = makeURI();
	qrcode.clear();
	qrcode.makeCode(uri);
	document.getElementById("urilink").href = uri;
}

function onRandomClicked() {
	var secret = document.getElementById("secret");
	var bytes = new Uint8Array(35);

	window.crypto.getRandomValues(bytes);
	secret.value = base32.encode(bytes);
	onValueChanged();
}

function onLockClicked() {
	var lock = document.getElementById("lock");
	onValueChanged();
}
