    // Открытие попапа
    document.getElementById('openForm').addEventListener('click', function() {
        document.getElementById('popup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
        history.pushState({popupOpen: true}, '', '?popup=open'); // Изменение URL
        loadStoredData(); // Загружаем сохраненные данные
    });

    // Закрытие попапа
    document.getElementById('closePopup').addEventListener('click', closePopup);
    document.getElementById('overlay').addEventListener('click', closePopup);

    function closePopup() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        history.back(); // Возврат к предыдущему состоянию
    }

    // Обработка отправки формы
    document.getElementById('feedbackForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Предотвращение перезагрузки страницы
        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            organization: document.getElementById('organization').value,
            message: document.getElementById('message').value,
            consent: document.getElementById('consent').checked
        };
        
        // Отправка данных на сервер
        fetch('https://formcarry.com/s/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('responseMessage').textContent = 'Сообщение отправлено!';
            clearForm();
        })
        .catch(error => {
            document.getElementById('responseMessage').textContent = 'Ошибка отправки: ' + error.message;
        });
    });
    // Сохранение и загрузка данных
    function loadStoredData() {
        const fields = ['name', 'email', 'phone', 'organization', 'message'];
        fields.forEach(field => {
            const value = localStorage.getItem(field);
            if (value) document.getElementById(field).value = value;
        });
    }

    function clearForm() {
        const fields = ['name', 'email', 'phone', 'organization', 'message'];
        fields.forEach(field => {
            document.getElementById(field).value = '';
            localStorage.removeItem(field); // Очищаем хранилище
        });
        document.getElementById('consent').checked = false; // Сбрасываем чекбокс
    }

    // Обработка события "Назад"
    window.onpopstate = function(event) {
        if (event.state && event.state.popupOpen) {
            closePopup();
        }
    };
    $(function(){
        $(".formcarryForm").submit(function(e){
          e.preventDefault();
          var href = $(this).attr("action");
          
          $.ajax({
              type: "POST",
              url: href,
              data: new FormData(this),
              dataType: "json",
              processData: false,
              contentType: false,
              success: function(response){
                if(response.status == "success"){
                    alert("We received your submission, thank you!");
                }
                else if(response.code === 422){
                  alert("Field validation failed");
                  $.each(response.errors, function(key) {
                    $('[name="' + key + '"]').addClass('formcarry-field-error');
                  });
                }
                else{
                  alert("An error occured: " + response.message);
                }
              },
              error: function(jqXHR, textStatus){
                const errorObject = jqXHR.responseJSON
      
                alert("Request failed, " + errorObject.title + ": " + errorObject.message);
              },
              complete: function(){
                // This will be fired after request is complete whether it's successful or not.
                // Use this block to run some code after request is complete.
              }
          });
        });
      });
