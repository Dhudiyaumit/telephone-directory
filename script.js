$(document).ready(function () {
    $('#country').on('change', function () {
        let country = $(this).val();
        updateStateCity(country);
    });
    $('#state').on('change', function () {
        let country = $('#country').val();
        let state = $(this).val();
        if (state) {
            populateDropdown('#city', data[country][state]);
        } else {
            $('#city').empty().append('<option value="">Select City</option>');
        }
    });
    $('#agreeTerms').on('change', function () {
        if ($(this).prop('checked')) {
            $('#saveBtn').prop('disabled', false);
        } else {
            $('#saveBtn').prop('disabled', true);
        }
    });
    $('#prevPageBtn').on('click', function () {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
        }
    });
    $('#nextPageBtn').on('click', function () {
        const totalRecords = JSON.parse(localStorage.getItem('directoryData'))?.length || 0;
        if (currentPage < Math.ceil(totalRecords / recordsPerPage)) {
            currentPage++;
            displayTable();
        }
    });
    $('#saveBtn').on('click', function () {
        let isValid = validateForm();

        if (isValid) {
            const entry = {
                fname: $('#fname').val(),
                mname: $('#mname').val(),
                lname: $('#lname').val(),
                phone: $('#phone').val(),
                email: $('#email').val(),
                address: $('#address').val(),
                country: $('#country').val(),
                state: $('#state').val(),
                city: $('#city').val(),
                gender: $('input[name="gender"]:checked').val()
            };

            let directoryData = JSON.parse(localStorage.getItem('directoryData')) || [];

            const editIndex = localStorage.getItem('editIndex');
            if (editIndex !== null) {
                directoryData[editIndex] = entry;
                localStorage.removeItem('editIndex');
                showMessage("Information Update successfully!", "info");
            } else {
                directoryData.push(entry);
                showMessage("Information saved successfully!", "success");
            }

            localStorage.setItem('directoryData', JSON.stringify(directoryData));

            displayTable();
            clearForm();
        }
    });
    $('#clearBtn').on('click', function () {
        clearForm();
    });
    const input = document.querySelector("#phone");
        let iti = window.intlTelInput(input, {
            initialCountry: "in", // Set India as the default country
            separateDialCode: true,  // To show the country code in a separate field
            preferredCountries: ["in", "us", "uk", "ca", "au"],          
        });
    const countryCodemapping = {
            india : "in",
            usa : "us",
            uk: "gb",
            canada: "ca",
            australia: "au"
    } 
    $("#country").change(function () {
            let selectedCountry = $(this).val().toLowerCase(); // Get the selected country
            if (countryCodemapping[selectedCountry]) {
                iti.setCountry(countryCodemapping[selectedCountry]);  // Set country to India
            } else {
                iti.setCountry("us");  // Set country to USA
            }
     });
    $('#phone').on('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });
    $("#fname, #mname, #lname, #address, #email, #phone, #country, #state, #city, #gender" ).on("input", function () {
        $(this).next(".error").text("");
    }); 
    $('#tableBody').on('click', '.edit-btn', function () {
        const index = $(this).data('index');
        const directoryData = JSON.parse(localStorage.getItem('directoryData'));
        const entry = directoryData[index];

        $('#fname').val(entry.fname);
        $('#mname').val(entry.mname);
        $('#lname').val(entry.lname);
        $('#phone').val(entry.phone);
        $('#email').val(entry.email);
        $('#address').val(entry.address);
        $('#country').val(entry.country).trigger('change');
        $('#state').val(entry.state).trigger('change');
        $('#city').val(entry.city);
        $('input[name="gender"][value="' + entry.gender + '"]').prop('checked', true);
        $('#agreeTerms').prop('checked', true);
        $('#saveBtn').prop('disabled', false);

                localStorage.setItem('editIndex', index);
                displayTable();
    });

    // $('#tableBody').on('click', '.delete-btn', function () {
    //     const index = $(this).data('index');
    //     if (confirm("Are you sure you want to delete this entry?")) {
    //         let directoryData = JSON.parse(localStorage.getItem('directoryData'));
    //         directoryData.splice(index, 1);
    //         $('#deleteMessage').show(); // Show the message

    // // Hide the message after 3 seconds (3000 milliseconds)
    //     setTimeout(function() {
    //     $('#deleteMessage').fadeOut();
    //     }, 3000); 
    //         localStorage.setItem('directoryData', JSON.stringify(directoryData));
            
    //     }
    // });

    $('#tableBody').on('click', '.delete-btn', function () {
        const index = $(this).data('index');
        if (confirm("Are you sure you want to delete this entry?")) {
            let directoryData = JSON.parse(localStorage.getItem('directoryData')) || [];
            directoryData.splice(index, 1);
            localStorage.setItem('directoryData', JSON.stringify(directoryData));
            showMessage("Information deleted successfully!", "danger");
            
        }
    });

    $('#searchInput').on('input', function () {
        const searchValue = $(this).val().toLowerCase();
        const directoryData = JSON.parse(localStorage.getItem('directoryData')) || [];
        const tableBody = $('#tableBody');
        tableBody.empty();

        const filteredData = directoryData.filter(function (person) {
            return (
                person.fname.toLowerCase().includes(searchValue) ||
                person.mname.toLowerCase().includes(searchValue) ||
                person.lname.toLowerCase().includes(searchValue) ||
                person.phone.includes(searchValue) ||
                person.gender.toLowerCase().includes(searchValue) ||
                person.address.toLowerCase().includes(searchValue) ||
                person.country.toLowerCase().includes(searchValue) ||
                person.state.toLowerCase().includes(searchValue) ||
                person.city.toLowerCase().includes(searchValue)
            );
        });

        if (filteredData.length === 0) {
            tableBody.append('<tr><td colspan="10">No results found</td></tr>');
        } else {
            filteredData.forEach((entry, index) => {
                tableBody.append(`
                    <tr>
                        <td>${entry.fname}</td>
                        <td>${entry.mname}</td>
                        <td>${entry.lname}</td>
                        <td>${entry.phone}</td>
                        <td>${entry.email}</td>
                        <td>${entry.address}</td>
                        <td>${entry.country}</td>
                        <td>${entry.state}</td>
                        <td>${entry.city}</td>
                        <td>${entry.gender}</td>
                        <td>
                            <button class="edit-btn" data-index="${index}">Edit</button>
                            <button class="delete-btn" data-index="${index}">Delete</button>
                        </td>
                    </tr>
                `);
            });
        }
    });

    displayTable();
});

const data = {
    USA: {
        California: ["Los Angeles", "San Francisco", "San Diego"],
        Texas: ["Houston", "Dallas", "Austin"]
    },
    Canada: {
        Ontario: ["Toronto", "Ottawa", "Mississauga"],
        Quebec: ["Montreal", "Quebec City", "Laval"]
    },
    India: {
        Gujarat: ["Rajkot", "Ahmedabad", "Morbi"]
    }
};

function populateDropdown(selector, options) {
    $(selector).empty().append('<option value="">Select</option>');
    options.forEach(option => {
        $(selector).append(`<option value="${option}">${option}</option>`);
    });
}
populateDropdown('#country', Object.keys(data));

function updateStateCity(country, state = '') {
    if (country) {
        populateDropdown('#state', Object.keys(data[country]));
        if (state) {
            populateDropdown('#city', data[country][state]);
        } else {
            $('#city').empty().append('<option value="">Select City</option>');
        }
    } else {
        $('#state, #city').empty().append('<option value="">Select</option>');
    }
}

    let currentPage = 1;
    const recordsPerPage = 3;

    function displayTable() {
        const directoryData = JSON.parse(localStorage.getItem('directoryData')) || [];
        const tableBody = $('#tableBody');
        tableBody.empty();

        if (directoryData.length === 0) {
            tableBody.append('<tr><td colspan="10">No data available</td></tr>');
            $('#paginationControls').hide();
        } else {
            $('#paginationControls').show();
            let startIndex = (currentPage - 1) * recordsPerPage;
            let endIndex = startIndex + recordsPerPage;
            let paginatedData = directoryData.slice(startIndex, endIndex);

            paginatedData.forEach((entry, index) => {
                tableBody.append(`
                    <tr>
                        <td>${entry.fname}</td>
                        <td>${entry.mname}</td>
                        <td>${entry.lname}</td>
                        <td>${entry.phone}</td>
                        <td>${entry.email}</td>
                        <td>${entry.address}</td>
                        <td>${entry.country}</td>
                        <td>${entry.state}</td>
                        <td>${entry.city}</td>
                        <td>${entry.gender}</td>
                        <td>
                            <button class="edit-btn" data-index="${index + startIndex}">Edit</button>
                            <button class="delete-btn" data-index="${index + startIndex}">Delete</button>
                        </td>
                    </tr>
                `);
            });
            updatePaginationControls(directoryData.length);
        }
    }

    function updatePaginationControls(totalRecords) {
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        $('#totalPages').text(totalPages);
        $('#currentPage').text(currentPage);
        $('#prevPageBtn').prop('disabled', currentPage === 1);
        $('#nextPageBtn').prop('disabled', currentPage === totalPages);
    }
    
    function validateForm() {
        let isValid = true;

        $('.error').text('');

        if ($('#fname').val().trim() === '') {
            $('#fname').after('<span class="error">⚠ First Name is required!</span>');
            isValid = false;
        }
        
        else {
            $("#fnameerror").text("");
        }

        if ($('#mname').val().trim() === '') {
            $('#mname').after('<span class = "error">⚠ Middle Name is required!</span>');
            isValid = false;
        }

        if ($('#lname').val().trim() === '') {
            $('#lname').after('<span class = "error">⚠ Last Name is required!</span>');
            isValid = false;
        }

        if ($('#address').val().trim() === '') {
            $('#address').after('<span class = "error">⚠ Address is required!</span>');
            isValid = false;
        }

        const phone = $('#phone').val().trim();
        if (!phone || !/^\d{10}$/.test(phone)) {
            $('#phone').after('<span class = "error">⚠ Please enter a valid 10-digit phone number!</span>');
            isValid = false;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if ($('#email').val().trim() === '') {
            $('#email').after('<span class = "error">⚠ Email is required!</span>');
            isValid = false;
        } else if (!emailRegex.test($('#email').val().trim())) {
            $('#email').after('<span class ="error">⚠ Invalid email format!</span>');
            isValid = false;
        }

        if ($('#country').val() === '') {
            $('#country').after('<span class="error">⚠ Country is required!</span>');
            isValid = false;
        }

        if ($('#state').val() === '') {
            $('#state').after('<span class="error">⚠ State is required!</span>');
            isValid = false;
        }

        if ($('#city').val() === '') {
            $('#city').after('<span class = "error">⚠ City is required</span>');
            isValid = false;
        }

        if (!$('input[name="gender"]:checked').val()) {
            $('#gender').after('<span class = "error">⚠ Gender is required!</span>');
            isValid = false;
        }

        if (!$('#agreeTerms').prop('checked')) {
            $('#agreeTerms').after('<span class = "error">⚠ You must agree to the Terms and Conditions</span>');
            isValid = false;
        }

        return isValid;
    }
    function clearForm() {
        $('#directoryForm')[0].reset();
        $('#saveBtn').prop('disabled', true);
        $('#agreeTerms').prop('checked', false);
        $('.error').text('');
        localStorage.removeItem('editIndex');
    }

    function showMessage(message, type = "success") {
        let messageDiv = $("#messageBox");
    
        // Set message text
        messageDiv.text(message);
    
        // Remove previous classes and add the correct class based on the type
        messageDiv.removeClass("alert-success alert-danger alert-info")
                  .addClass(`alert-${type}`);
    
        // Show the message
        messageDiv.show().delay(3000).fadeOut();
    }
