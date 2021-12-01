(function (document, window) {
    class FilterSearch {
        constructor() {
            this.name = $('#name').val() || '';
            this.type = $('#type').val() || '';
            this.room = $('#room').val() || '';
            this.pricePerMonth = $('#pricePerMonth').val() || '';
            this.furniture = $('#furniture').val() || '';
        }
        getName() {
            return this.name || '';
        }
        getData() {
            const data = {};
            if (this.name) {
                data['name'] = this.name;
            }
            if (this.type) {
                data['type'] = this.type;
            }
            if (this.room) {
                data['room'] = this.room;
            }
            if (this.pricePerMonth) {
                data['pricePerMonth'] = this.pricePerMonth;
            }
            if (this.furniture) {
                data['furniture'] = this.furniture;
            }
            return data;
        }
    }

    function setStorageFilterSearch(searchData) {
        localStorage.setItem('filterSearch', JSON.stringify(searchData));
    }

    function validateForm(filterSearch) {
        let isValid = true;
        return isValid;
        if (!filterSearch.getName()) {
            window.toastMessage(`Please input name`, 'error');
            isValid = false;
        }
        return isValid;
    }

    $('#search').on('click', function () {
        const filterSearch = new FilterSearch();
        const isValidFormData = validateForm(filterSearch);
        if (isValidFormData) {
            const searchData = filterSearch.getData();
            setStorageFilterSearch(searchData);
            window.location.href = './SearchDetail.html';
        }
    });
})(document, window);