// Device ID — identifies this PC or phone. Generated once, stored forever.
const deviceId = () => {
  let id = ls.get('av_device_id');
  if (!id) {
    id = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    ls.set('av_device_id', id);
  }
  return id;
};
const deviceName = () => {
  let n = ls.get('av_device_name');
  if (!n) {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) n = 'Android phone';
    else if (/iphone|ipad|ipod/i.test(ua)) n = 'iPhone';
    else if (/mac/i.test(ua)) n = 'Mac';
    else if (/win/i.test(ua)) n = 'PC';
    else if (/linux/i.test(ua)) n = 'Linux';
    else n = 'Device';
    n += ' ' + Math.random().toString(36).slice(2, 5).toUpperCase();
  }
  return n;
};
const setDeviceName = (n) => ls.set('av_device_name', n);
