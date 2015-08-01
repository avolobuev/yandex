/*
 * 
 * Главная проблема данной реализации в том, что она не учитывает специфики работы функции setTimeout: асинхронность. 
 * В цикле мы запускаем несколько запросов к нашему API, который в свою очередь запускает функцию callback путем вызова функции setTimeout, 
 * но в отличии от обычного вызова функции основной поток продолжает работу после передачи управления setTimeout(она же ставит необходимую function() в очередь на обработку).
 * В итоге получаем что основной поток никогда не попадет в блок if (l.length == 3) { ... }, т.к. когда будут запущены три вызова callback
 * они будут все иметь на входе request = requests[2]('/populations') и получим responses['/populations'] = тому, что вернуло API для данного ключа. 
 * И значит мы никогда не получим массив с 3-мя разными ключами и значениями ассоцированными с ними, как задумывалось.
 * 
 * Чтобы все же заставить работать данную реализацию нужно вынести var l = [] за цикл, т.е. будем его накапливать, и тогда зайдем в тело условия. 
 * У нас возникнут проблемы с тем, что в responses нет ключа '/countries' и '/cities', мы получим ошибку, т.к. пытаемся обратится к свойству length, несуществующего массива значений (for (i = 0; i < responses['/countries'].length ( = null.length); i++) {...}). 
 * Если мы уберем эти циклы и оставим только цикл: for (i = 0; i < responses['/populations'].length; i++){...}, то получим вполне очевидный результат:
 * Total population in African cities: 0, т.к. массивы var c = [], cc = [] не были накоплены и значит суммировать нечего.
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
        var l = [];//вынести за цикл
        for (K in responses)
            l.push(K);
 
        if (l.length == 3) {//лучше ===
            var c = [], cc = [], p = 0;
            for (i = 0; i < responses['/countries'].length; i++) {//будет ошибка т.к. нет responses['/countries']
                if (responses['/countries'][i].continent === 'Africa') {
                    c.push(responses['/countries'][i].name);
                }
            }
 
            for (i = 0; i < responses['/cities'].length; i++) {//будет ошибка т.к. нет responses['/cities']
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