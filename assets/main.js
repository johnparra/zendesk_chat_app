$(function () {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '180px' });
    showSearchForm();

    $("#get-btn").click(function (event) {
        event.preventDefault();
        var search_str = $("#subject-field").val();
        getArticles(search_str, client);
    });
});

function showSearchForm() {
    var source = $("#search-template").html();
    var template = Handlebars.compile(source);
    $("#content").html(template());
}

function showError() {
    var error_data = {
        'code': 'codestring',
        'info': 'info text'
    };
    var source = $("#error-template").html();
    var template = Handlebars.compile(source);
    var html = template(error_data);
    $("#content").html(html);
}

function getArticles(search_str, client) {
    var parameters = {
        action: 'query',
        list: 'search',
        srsearch: search_str,
        srlimit: 3,
        format: 'json'
    };
    var settings = {
        url: 'https://en.wikipedia.org/w/api.php',
        data: parameters,
        headers: { 'Api-User-Agent': 'MyChatApp/1.0 (jdoe@example.net)' },
        dataType: 'json'
    };
    client.request(settings).then(
        function (response) {
            if (response.error) {
                showError(response.error);
            }
            var articles = response.query.search;
            var msg = buildMessage(articles);
            client.invoke('chat.postToChatTextArea', msg);
        }
    );
}

function buildMessage(articles) {
    var message = '';
    var url = 'https://en.wikipedia.org/wiki/';
    for (i = 0; i < articles.length; i++) {
        message += '"' + articles[i].title + '" - ' + url + encodeURI(articles[i].title) + '\n';
    }
    return message;
}