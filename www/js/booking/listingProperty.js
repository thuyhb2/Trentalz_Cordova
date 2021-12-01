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

    const index = $(this).attr("number") || '';
    if (index) {
        localStorage.setItem('selectPropertyIndex', index);
        window.location.href = './DetailsProperty.html';
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
                // const cost = data[i]['pricePerMonth'] ? window.formatNumberToMoney(data[i]['pricePerMonth']) : null;
                const roomCode = data[i]['room'] || '';
                const roomName = roomCode && room ? room[roomCode] : '';
                const typeCode = data[i]['room'] || '';
                const typeName = typeCode && type ? type[typeCode] : '';
                //   //  <h2><p>${roomName} - ${typeName}</p></h2>
                const index = data[i]['index'] || '';
                contentHTML += `<li>
                    <div class="product-thumb search-detail" number="${index}">
                        <div class="image">
                            <a> <img src="images/listingProperty/${index}.jpg"
                                    class="img-responsive" alt="img1" title="img1" /></a>
                            <div class="hoverbox">
                                <div class="icon_plus" aria-hidden="true"></div>
                            </div>
                        </div>
                        <div class="caption">
                            <a><h1 style="text-align: center;">${name}</h1></a>
                     
                        </div>
                    </div>
                </li>`;
            }
        }
        $('.listing-property').append(contentHTML);
        $('.search-detail').on('click', function (ele) {
            const index = $(this).attr("number") || '';
            if (index) {
                localStorage.setItem('selectPropertyIndex', index);
                window.location.href = './DetailsProperty.html';
            }
        });
    }

    function initData() {
        const propertyData = JSON.parse(localStorage.getItem('propertyData')) || '';
        if (propertyData) {
            appendDataToHTML(propertyData);
        }
    }

    initData();
})(document, window);