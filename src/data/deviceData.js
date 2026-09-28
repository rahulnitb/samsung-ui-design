// Mock device identity. A real TV would read these from its own OS (Tizen's device
// unique id / a paired-account guid); here they're static mock data, sent as the
// params of the (dummy) QR-code request.
export const deviceInfo = {
  duid: 'TV-DUID-8F21',
  guid: 'GUID-4B7E-91AC',
};
