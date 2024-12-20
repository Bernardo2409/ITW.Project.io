function formatValue(value) {
    return value ? value : "[sem informação]";
}
var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Canoe_Sprints');
    self.displayName = 'Canoe Sprints Event Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Event = ko.observableArray([]);
    self.activate = function (EventId, StageId) {
        console.log('CALL: getSports...');
        var composedUri = self.baseUri() + '?EventId=' + encodeURIComponent(EventId) + "&StageId=" + encodeURIComponent(StageId);
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log('Dados recebidos:', data);
            console.log('URL da API:', composedUri);
            hideLoading();
    
            const formattedData = data.map(item => {
                if (item.ParticipantType === 'Person') {
                    item.ParticipantTypeFormatted = 'Athlete';
                } else if (item.ParticipantType === 'Team') {
                    item.ParticipantTypeFormatted = 'Teams';
                } else {
                    item.ParticipantTypeFormatted = formatValue(item.ParticipantType);
                }
                return item;
            });
    
            self.Event(formattedData);
        });
    };

       

    function ajaxHelper(uri, method, data) {
        self.error(''); 
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param); 
    }

    showLoading();
    var EventId = getUrlParameter('EventId');
    var StageId = getUrlParameter('StageId');

    if (!EventId || !StageId)
        console.error("Parâmetros da URL estão faltando ou inválidos.");
    else {
        self.activate(EventId,StageId);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
