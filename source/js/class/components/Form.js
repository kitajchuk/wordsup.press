import * as core from "../../core";

class Form {
  constructor(element, data) {
    this.element = element;
    this.fields = null;
    this.elemData = data;
    this.formData = {};
    this.action = this.elemData.action;
    this.recaptcha = this.element.find(".g-recaptcha");

    this.bind();
    this.captcha();
    this.specialLoad();
  }

  specialLoad() {
    if (this.action === "Special-Offer") {
      this.download = core.dom.main.find(".js-download").detach();
      this.downloadData = this.download.data();
    }
  }

  specialDone() {
    if (this.action === "Special-Offer") {
      window.open(this.downloadData.file);
    }
  }

  captcha() {
    if (this.recaptcha.length) {
      this.script = document.createElement("script");
      this.script.src = "https://www.google.com/recaptcha/api.js";
      this.element.append(this.script);
    }
  }

  bind() {
    this.element.on("submit", (e) => {
      e.preventDefault();
      this.processForm();
      return false;
    });

    if (this.elemData.action === "Signup") {
      this.element.on("keypress", (e) => {
        if (e.keyCode === 13) {
          e.preventDefault();
          this.processForm();
          return false;
        }
      });
    }
  }

  handleErrors() {
    this.element.removeClass("is-success is-processing");
  }

  handleSuccess() {
    this.element.addClass("is-success").removeClass("is-processing");
    this.clearForm();
    this.specialDone();
  }

  processForm() {
    this.element.addClass("is-processing");
    this.getFields();
    this.parseForm();
    this.postForm()
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.handleSuccess(json);
        } else {
          this.handleErrors(json);
        }
      });
  }

  getFields() {
    this.fields = this.element.find(".js-form-field");
  }

  parseForm() {
    this.formData = {
      _action: this.action,
      _form: {},
    };

    if (this.recaptcha.length) {
      this.formData._recaptcha = this.recaptcha.find(
        ".g-recaptcha-response",
      )[0].value;
    }

    this.fields.forEach((el) => {
      this.formData._form[el.name] = {
        name: el.name,
        type: el.type,
        value: el.value,
      };
    });
  }

  postForm() {
    return fetch(this.elemData.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.formData),
    });
  }

  clearForm() {
    this.formData = {};
    this.fields.forEach((el) => {
      el.value = "";
    });
  }

  destroy() {
    this.element.off();
  }
}

/******************************************************************************
 * Export
 *******************************************************************************/
export default Form;
