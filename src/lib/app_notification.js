class AppNotification {
  constructor() {
    this.state = {
      permission: null
    };

    this.getState         = this.getState.bind(this);
    this.setState         = this.setState.bind(this);
    this.ensureNotifiable = this.ensureNotifiable.bind(this);
    this.show             = this.show.bind(this);
    this.showWithIcon     = this.showWithIcon.bind(this);

    // TODO: re-activate Desktop Notification
    // Don't activate notification permission yet
    if (window.APP_ENV === 'development' ) {
      this.ensureNotifiable();
    }
  }

  setState(state) {
    Object.assign(this.state, state);
  }

  getState() {
    return this.state;
  }

  ensureNotifiable() {
    if (!('Notification' in window)) { // Let's check if the browser supports notifications
    } else if (Notification.permission === 'granted') {
      this.setState({
        permission: 'granted'
      });
    } else if (Notification.permission !== 'denied') { // Otherwise, we need to ask the user for permission
      Notification.requestPermission( (permission) => {
        if (permission === 'granted') {
          this.setState({
            permission: 'granted'
          });
        } else if (permission === 'denied') {
          this.setState({
            permission: 'denied'
          });
        }
      });
    }
  }

  show(title, body) {
    this.showWithIcon(title, body, '/images/welcome-bee.png');
  }

  showWithIcon(title, body, icon) {
    // TODO: re-activate Desktop Notification
    // disable Desktop Notification calls
    if (window.APP_ENV === 'production') {
      return;
    }

    let defaultIcon = '/images/welcome-bee.png';

    let options = {
      body: body,
      icon: icon || defaultIcon
    };

    let n = new Notification(title, options);

    setTimeout(n.close.bind(n), 5000);
  }
}

export default new AppNotification();
