// Edit these values to change site-wide details.
export const site = {
  name: 'Intracoastal Cleaning',
  url: 'https://www.intracoastalcleaning.com',
  email: 'info@intracoastalcleaning.com',
  phone: '', // e.g. '(910) 555-0123' — shown in header/footer with tap-to-call when set
  // Web3Forms access key. Leads are emailed to the address the key was created with.
  web3formsKey: '',
  areas: ['Wilmington', 'Wrightsville Beach', 'Carolina Beach', 'Leland', 'Hampstead', 'Porters Neck', 'Ogden', 'Monkey Junction'],
};

export const img = (id, w = 1200, h) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=70`;
