(function (document, window) {
    class Property {
        constructor() {
            this.name = $('#name').val() || '';
            this.address = $('#address').val() || '';
            this.type = $('#type').val() || '';
            this.room = $('#room').val() || '';
            this.createdAt = $('#createdAt').val() || '';
            this.pricePerMonth = $('#pricePerMonth').val() || '';
            this.furniture = $('#furniture').val() || '';
            this.noted = $('#noted').val() || '';
        }
        getPropertyInfo() {
            let convertTimeStamp = '';
            if (this.createdAt) {
                convertTimeStamp = new Date(this.createdAt).getTime();
            }
            return {
                name: this.name,
                address: this.address,
                type: this.type,
                room: this.room,
                createdAt: convertTimeStamp, // this.createdAt,
                pricePerMonth: this.pricePerMonth,
                furniture: this.furniture,
                noted: this.noted
            }
        }
    }

    function getStorageData(keyName = '') {
        const data = localStorage.getItem(keyName) || '';
        return data ? JSON.parse(data) : null;
    }

    function getPropertyList() {
        return getStorageData('propertyData');
    }

    function getOne(index, data) {
        for (const item of data) {
            if (item.index === index) {
                return item;
            }
        }
        return null;
    }

    function getPropertyDetail(index = '') {
        let data = {};
        if (index) {
            const currentProperties = getPropertyList();
            data = getOne(index, currentProperties);
        }
        return data || null;
    }

    function initFormInput(formData) {
        for (const key in formData) {
            const value = formData[key] || '';
            if (value === '') {
                continue;
            }
            if (key === 'createdAt') {
                const formatDate = window.convertDate(value);
                $(`#${key}`).val(formatDate);
                continue;
            }
            $(`#${key}`).val(value);
        }
    }

    function validateForm(data) {
        let isValid = true;
        for (const key in data) {
            const txt = window.CONSTANT_DATA.LOCALE_VI[key] || '';
            if (txt) {
                if (!data[key]) {
                    $(`#${key}`).css('border-color', 'red');
                    $(`#${key}`).focus();
                    window.toastMessage(`Please enter ${txt}`, 'error');
                    isValid = false;
                    break;
                } else {
                    if (key === 'createdAt') {
                        const value = $(`#${key}`).val();
                        if (value.indexOf('/') === -1) {
                            $(`#${key}`).val('');
                            window.toastMessage(`Please choose ${txt}`, 'error');
                            isValid = false;
                            break;
                        }
                    }
                    $(`#${key}`).css('border-color', 'green');
                }
            }
        }
        return isValid;
    }

    function updateDataStorage(index, data) {
        const propertyData = localStorage.getItem('propertyData') || '';
        let currentProperties = JSON.parse(propertyData);
        const selectItemIndex = index ? index - 1 : null;
        if (selectItemIndex != null && currentProperties[selectItemIndex]) {
            currentProperties[selectItemIndex] = {
                ...currentProperties[selectItemIndex],
                ...data
            };
            localStorage.setItem('propertyData', JSON.stringify(currentProperties));
        }
    }
    
    function updateProperty(index, data) {
        const isValidFormData = validateForm(data);
        if (isValidFormData) {
            updateDataStorage(index, data);
            window.toastMessage('Update Property Success', 'success');
            setTimeout(()=> {
                window.location.href = './DetailsProperty.html';
            }, 1000);
        }
    }

    function initData() {
        const currentIndex = getStorageData('selectPropertyIndex');
        const propertyDetail = getPropertyDetail(currentIndex);
        initFormInput(propertyDetail);
    }

    initData();
    $('#update').on('click', function () {
        const property = new Property();
        const propertyInfo = property.getPropertyInfo();
        const currentIndex = getStorageData('selectPropertyIndex');
        updateProperty(currentIndex, propertyInfo);
    });
})(document, window);