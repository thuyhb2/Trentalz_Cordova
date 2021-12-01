(function (document, window) {
    // Login Section
    if (window.name != 'homepage')
        return false;
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

    function clearFormData(formData) {
        for (const key in formData) {
            if (formData[key]) {
                $(`#${key}`).val('');
                $(`#${key}`).css('border-color', 'inherit');
            }
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
                    window.toastMessage(`Please input ${txt}`, 'error');
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

    function setDataStorage(data) {
        const propertyData = localStorage.getItem('propertyData') || '';
        if (!propertyData) {
            data['index'] = 1;
            const saveData = [data];
            localStorage.setItem('propertyData', JSON.stringify(saveData));
        } else {
            const currentProperties = JSON.parse(propertyData);
            if (data) {
                data['index'] = currentProperties.length + 1;
                currentProperties.push(data);
                localStorage.setItem('propertyData', JSON.stringify(currentProperties));
            }
        }
    }

    function confirm() {
        const property = new Property();
        const propertyInfo = property.getPropertyInfo();
        const isValidFormData = validateForm(propertyInfo);
        if (isValidFormData) {
            setDataStorage(propertyInfo);
            window.toastMessage('Create Property Success', 'success');
        }
    }

    $('#confirm').on('click', function () {
        confirm();
    });
})(document, window);