(function (document, window) {
    function getStorageData(keyName = '') {
        const data = localStorage.getItem(keyName) || '';
        return data ? JSON.parse(data) : null;
    }

    function isMatchValue(mainValue, inputValue) {
        return mainValue.indexOf(inputValue) === -1;
    }

    function checkIsMatchFilter(data, filters) {
        let isValid = true;
        for (const key in data) {
            if (filters[key] && isMatchValue(data[key], filters[key])) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    function getPropertyData(filters) {
        const validData = [];
        const propertyData = JSON.parse(localStorage.getItem('propertyData')) || '';
        for (const i in propertyData) {
            if (propertyData[i]) {
                const data = propertyData[i];
                const isDataMatchFilter = checkIsMatchFilter(data, filters);
                if (isDataMatchFilter) {
                    validData.push(data);
                }
            }
        }
        return validData;
    }

    function appendDataToHTML(data) {
        const {
            room,
            type
        } = window.CONSTANT_DATA;

        let contentHTML = '';
        for (const i in data) {
            if (data[i]) {
                const name = data[i]['name'] || '';
                const cost = data[i]['pricePerMonth'] ? window.formatNumberToMoney(data[i]['pricePerMonth']) : null;
                const roomCode = data[i]['room'] || '';
                const roomName = roomCode && room ? room[roomCode] : '';
                const typeCode = data[i]['type'] || '';
                const typeName = typeCode && type ? type[typeCode] : '';
                const index = data[i]['index'] || '';
                contentHTML += `
                    <div class="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                    <div class="product-thumb">
                        <div class="image">
                            <a href="#"><img src="images/propertyDetail/${index}.jpg" alt="p2" title="p2"
                                    class="img-responsive" /></a>
                            <div class="hoverbox">
                                <div class="icon_plus" aria-hidden="true"></div>
                            </div>
                            <div class="matter">
                                <h2>${name}</h2>
                                <p>Giá từ ${cost} VND</p>
                                <ul class="list-inline">
                                    <li><a href="#">${roomName}</a></li>
                                    <li><a href="#">${typeName}</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="caption">
                            <div class="text-center">
                                <button id="search-detail" number="${index}" type="button">
                                   View Details
                                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        }
        $('.tab-content').prepend(contentHTML);
        $('#search-detail').on('click', function (ele) {
            const index = $(this).attr( "number" ) || '';
            if (index) {
                localStorage.setItem('selectPropertyIndex', index);
                window.location.href = './DetailsProperty.html';
            }
        });
    }

    function initData() {
        const filterSearch = getStorageData('filterSearch');
        if (filterSearch) {
            const matchData = getPropertyData(filterSearch);
            appendDataToHTML(matchData);
        }
    }

    initData();
})(document, window);