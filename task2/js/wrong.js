/*
 * 
 * ������� �������� ������ ���������� � ���, ��� ��� �� ��������� ��������� ������ ������� setTimeout: �������������. 
 * � ����� �� ��������� ��������� �������� � ������ API, ������� � ���� ������� ��������� ������� callback ����� ������ ������� setTimeout, 
 * �� � ������� �� �������� ������ ������� �������� ����� ���������� ������ ����� �������� ���������� setTimeout(��� �� ������ ����������� function() � ������� �� ���������).
 * � ����� �������� ��� �������� ����� ������� �� ������� � ���� if (l.length == 3) { ... }, �.�. ����� ����� �������� ��� ������ callback
 * ��� ����� ��� ����� �� ����� request = requests[2]('/populations') � ������� responses['/populations'] = ����, ��� ������� API ��� ������� �����. 
 * � ������ �� ������� �� ������� ������ � 3-�� ������� ������� � ���������� ��������������� � ����, ��� ������������.
 * 
 * ����� ��� �� ��������� �������� ������ ���������� ����� ������� var l = [] �� ����, �.�. ����� ��� �����������, � ����� ������ � ���� �������. 
 * � ��� ��������� �������� � ���, ��� � responses ��� ����� '/countries' � '/cities', �� ������� ������, �.�. �������� ��������� � �������� length, ��������������� ������� �������� (for (i = 0; i < responses['/countries'].length ( = null.length); i++) {...}). 
 * ���� �� ������ ��� ����� � ������� ������ ����: for (i = 0; i < responses['/populations'].length; i++){...}, �� ������� ������ ��������� ���������:
 * Total population in African cities: 0, �.�. ������� var c = [], cc = [] �� ���� ��������� � ������ ����������� ������.
 * 
 */


var requests = ['/countries', '/cities', '/populations'];
var responses = {};

//var l = [];
for (i = 0; i < 3; i++) 
{
    var request = requests[i];
    var callback = function (error, result) 
    {
        responses[request] = result;
        var l = [];//������� �� ����
        for (K in responses)
            l.push(K);
 
        if (l.length == 3) {//����� ===
            var c = [], cc = [], p = 0;
            for (i = 0; i < responses['/countries'].length; i++) {//����� ������ �.�. ��� responses['/countries']
                if (responses['/countries'][i].continent === 'Africa') {
                    c.push(responses['/countries'][i].name);
                }
            }
 
            for (i = 0; i < responses['/cities'].length; i++) {//����� ������ �.�. ��� responses['/cities']
                for (j = 0; j < c.length; j++) {
                    if (responses['/cities'][i].country === c[j]) {
                        cc.push(responses['/cities'][i].name);
                    }
                }
            }
 
            for (i = 0; i < responses['/populations'].length; i++) {
                for (j = 0; j < cc.length; j++) {
                    if (responses['/populations'][i].name === cc[j]) {
                        p += responses['/populations'][i].count;
                    }
                }
            }
 
            console.log('Total population in African cities: ' + p);//p = 0
        }
    };
 
    getData(request, callback);
}