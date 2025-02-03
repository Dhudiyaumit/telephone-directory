$(document).ready(function () {
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
                            </br><br/>
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

    $(document).on('click', '#prevPageBtn', function () {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
        }
    });

    $(document).on('click', '#nextPageBtn', function () {
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
                $('#updateMessage').show(); // Show the message

                // Hide the message after 3 seconds (3000 milliseconds)
                setTimeout(function() {
                    $('#updateMessage').fadeOut();
                }, 3000); 
            } else {
                directoryData.push(entry);
                $('#saveMessage').show(); // Show the message

                // Hide the message after 3 seconds (3000 milliseconds)
                setTimeout(function() {
                    $('#saveMessage').fadeOut();
                }, 3000); 
            }

            localStorage.setItem('directoryData', JSON.stringify(directoryData));

            displayTable();
            clearForm();
        }
    });

    $('#clearBtn').on('click', function () {
        clearForm();
    });
    $(document).ready(function () {
        const input = document.querySelector("#phone");
        let iti = window.intlTelInput(input, {
            initialCountry: "in", // Set India as the default country
            separateDialCode: true,  // To show the country code in a separate field
            preferredCountries: ["in", "us", "uk", "ca", "au"],
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // Required for utils
        });
        
        $("#country").change(function () {
            let selectedCountry = $(this).val().toLowerCase(); // Get the selected country
            if (selectedCountry === "india") {
                iti.setCountry("in");  // Set country to India
            } else if (selectedCountry === "usa") {
                iti.setCountry("us");  // Set country to USA
            }
        });
    
        // Validation for the phone number (e.g., 10 digits validation)
        $("#phone").on("input", function () {
            let phoneNumber = $(this).val();
            if (!/^\d{10}$/.test(phoneNumber)) {
                $("#phoneerror").text("⚠ Phone number must be exactly 10 digits.");
            } else {
                $("#phoneerror").text("");
            }
        });
    });
    function validateForm() {
        let isValid = true;

        $('.error').text('');

        if ($('#fname').val().trim() === '') {
            $('#fnameerror').text('⚠ First Name is required');
            isValid = false;
        }
        else {
            $("#fnameerror").text("");
        }

        if ($('#mname').val().trim() === '') {
            $('#mnameerror').text('⚠ Middle Name is required');
            isValid = false;
        }

        if ($('#lname').val().trim() === '') {
            $('#lnameerror').text('⚠ Last Name is required');
            isValid = false;
        }

        if ($('#address').val().trim() === '') {
            $('#addresserror').text('⚠ Address is required');
            isValid = false;
        }

        const phone = $('#phone').val().trim();
        if (!phone || !/^\d{10}$/.test(phone)) {
            $('#phoneerror').text('⚠ Please enter a valid 10-digit phone number.');
            isValid = false;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if ($('#email').val().trim() === '') {
            $('#emailerror').text('⚠ Email is required');
            isValid = false;
        } else if (!emailRegex.test($('#email').val().trim())) {
            $('#emailerror').text('⚠ Invalid email format');
            isValid = false;
        }

        if ($('#country').val() === '') {
            $('#countryerror').text('⚠ Country is required');
            isValid = false;
        }

        if ($('#state').val() === '') {
            $('#stateerror').text('⚠ State is required');
            isValid = false;
        }

        if ($('#city').val() === '') {
            $('#cityerror').text('⚠ City is required');
            isValid = false;
        }

        if (!$('input[name="gender"]:checked').val()) {
            $('#gendererror').text('⚠ Gender is required');
            isValid = false;
        }

        if (!$('#agreeTerms').prop('checked')) {
            $('#termserror').text('⚠ You must agree to the Terms and Conditions');
            isValid = false;
        }

        return isValid;
    }
    $("#fname, #mname, #lname, #address, #email, #phone, #country, #state, #city").on("input", function () {
        $(this).next(".error").text("");  // Clear error for the corresponding field
    });

    function clearForm() {
        $('#directoryForm')[0].reset();
        $('#saveBtn').prop('disabled', true);
        $('#agreeTerms').prop('checked', false);
        $('.error').text('');
        localStorage.removeItem('editIndex');
    }

    $(document).on('click', '.edit-btn', function () {
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

    $(document).on('click', '.delete-btn', function () {
        const index = $(this).data('index');
        if (confirm("Are you sure you want to delete this entry?")) {
            let directoryData = JSON.parse(localStorage.getItem('directoryData'));
            directoryData.splice(index, 1);
            $('#deleteMessage').show(); // Show the message

    // Hide the message after 3 seconds (3000 milliseconds)
        setTimeout(function() {
        $('#deleteMessage').fadeOut();
        }, 3000); 
            localStorage.setItem('directoryData', JSON.stringify(directoryData));
            displayTable();
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
                person.address.toLowerCase().includes(searchValue)
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
