const networkAddress = [10, 0, 0, 0];
const networkMask = [255, 0, 0, 0];

main('192.168.100.1/20');
main('192.168.200.1/20');
main('198.51.100.80/24');

export function main(address: string) {
	const maskMap = getMaskMap();
	const blockArr = address.split('/');
	const networkAddressSelected = blockArr[0];
	const addressBlockMandatoryBits = parseInt(blockArr[1]) > 30 ? 30 : parseInt(blockArr[1]);
	const subnetMaskSelected = maskMap[addressBlockMandatoryBits];

	setNetworkAddress(networkAddressSelected);
	setNetworkMask(subnetMaskSelected);

	const wildCard = calculateWildCardMask(networkMask);
	const maskBits = getBitsFromMask(networkMask);
	const subnetArray = getSubnetId(networkAddress, networkMask);
	const aBcast = broadcastAddress(networkAddress, wildCard);
	const startAddressArray = calculateStartIpAddress(networkAddress, networkMask);
	const endAddressArray = calculateEndIpAddress(networkAddress, wildCard);
	const startIpAddress = startAddressArray.join('.');
	const endIpAddress = endAddressArray.join('.');

	console.table({
		Eingaben: {
			Adresse: blockArr[0],
			Maske: blockArr[1],
		},
	});

	console.table({
		Ausgabe: {
			'Subnet ID': subnetArray.join('.'),
			'Host Address Range': startIpAddress + ' - ' + endIpAddress,
			'Broadcast Address': aBcast.join('.'),
			'Wildcard Address': wildCard.join('.'),
			Netmask: subnetMaskSelected,
			'CIDR Notation': subnetArray.join('.') + '/' + maskBits.indexOf('0'),
		},
	});
}

function setNetworkAddress(networkAddr: string) {
	const networkAddressArr = networkAddr.split('.');
	networkAddress[0] = parseInt(networkAddressArr[0]);
	networkAddress[1] = parseInt(networkAddressArr[1]);
	networkAddress[2] = parseInt(networkAddressArr[2]);
	networkAddress[3] = parseInt(networkAddressArr[3]);
}

function setNetworkMask(networkMaskAddress: string) {
	const networkMaskArr = networkMaskAddress.split('.');
	networkMask[0] = parseInt(networkMaskArr[0]);
	networkMask[1] = parseInt(networkMaskArr[1]);
	networkMask[2] = parseInt(networkMaskArr[2]);
	networkMask[3] = parseInt(networkMaskArr[3]);
}

function calculateWildCardMask(netMask: number[]) {
	const toReturn = [0, 0, 0, 0];
	for (var i = 0; i < 4; i++) {
		toReturn[i] = 255 - netMask[i];
	}
	return toReturn;
}

function getBitsFromMask(netMask: number[]) {
	const maskDecimal = convertOctetToDecimal(netMask);
	return maskDecimal.toString(2); //maskBinary
}

function convertOctetToDecimal(octetValue: number[]) {
	let decimalValue = 0;

	decimalValue += octetValue[0] * 16777216;
	decimalValue += octetValue[1] * 65536;
	decimalValue += octetValue[2] * 256;
	decimalValue += octetValue[3];

	return decimalValue;
}

function getSubnetId(address: number[], netMask: number[]) {
	const subnetId = [0, 0, 0, 0];

	for (let i = 0; i < 4; i++) {
		subnetId[i] = address[i] & netMask[i];
	}

	return subnetId;
}

function broadcastAddress(networkAddress: number[], wildMask: number[]) {
	const toReturn = [0, 0, 0, 0];

	for (let i = 0; i < 4; i++) {
		toReturn[i] = networkAddress[i] | wildMask[i];
	}

	return toReturn;
}

function calculateStartIpAddress(address: number[], netMask: number[]) {
	const subnetId = getSubnetId(address, netMask);
	subnetId[3] += 1;
	return subnetId;
}

function calculateEndIpAddress(networkAddress: number[], wildMask: number[]) {
	const broadcastAdd = broadcastAddress(networkAddress, wildMask);
	broadcastAdd[3] -= 1;
	return broadcastAdd;
}

function getMaskMap() {
	const maskMap = new Array<string>(33);
	maskMap[1] = '128.0.0.0';
	maskMap[2] = '192.0.0.0';
	maskMap[3] = '224.0.0.0';
	maskMap[4] = '240.0.0.0';
	maskMap[5] = '248.0.0.0';
	maskMap[6] = '252.0.0.0';
	maskMap[7] = '254.0.0.0';
	maskMap[8] = '255.0.0.0';
	maskMap[9] = '255.128.0.0';
	maskMap[10] = '255.192.0.0';
	maskMap[11] = '255.224.0.0';
	maskMap[12] = '255.240.0.0';
	maskMap[13] = '255.248.0.0';
	maskMap[14] = '255.252.0.0';
	maskMap[15] = '255.254.0.0';
	maskMap[16] = '255.255.0.0';
	maskMap[17] = '255.255.128.0';
	maskMap[18] = '255.255.192.0';
	maskMap[19] = '255.255.224.0';
	maskMap[20] = '255.255.240.0';
	maskMap[21] = '255.255.248.0';
	maskMap[22] = '255.255.252.0';
	maskMap[23] = '255.255.254.0';
	maskMap[24] = '255.255.255.0';
	maskMap[25] = '255.255.255.128';
	maskMap[26] = '255.255.255.192';
	maskMap[27] = '255.255.255.224';
	maskMap[28] = '255.255.255.240';
	maskMap[29] = '255.255.255.248';
	maskMap[30] = '255.255.255.252';
	maskMap[31] = '255.255.255.254';
	maskMap[32] = '255.255.255.255';

	return maskMap;
}
