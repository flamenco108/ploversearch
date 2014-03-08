function start() {
    $.getJSON("dict.json", function(dict) {
        $('#search').keyup(function() {
            return doSearch(dict);
        });
    });
}

var prev='';
var timer = -1;
var timer2 = -1;

function doSearch(dict) {
    term = $('#search').val().toLowerCase();
    if (term == prev) {
        return;
    }
    prev = term;
    var r = $('#result').find('tbody');
    r.empty();
    if (term.length <= 1) {
        return;
    }

    clearTimeout(timer);
    timer = setTimeout(function() {
        addMatchesToTable(dict, r, function(trans, term) {
            return trans.toLowerCase() != term
        });
    }, 0);

    clearTimeout(timer2);
    timer2 = setTimeout(function() {
        addMatchesToTable(dict, r, function(trans, term) {
            return trans.slice(0, term.length).toLowerCase() != term
        });
    }, 15);
}

function addMatchesToTable(dict, r, reject, found) {
    $.each(dict, function(code, trans) {
        if (found > 50) {
            return false;
        }
        if (reject(trans, term)) {
            return true;
        }
        ++found;
        r.append($('<tr>')
            .append($('<td>').html(code.replace(/\//g, '/&#8203;')))
            .append($('<td>').text(trans))
            );
    });
}
