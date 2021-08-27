const axios = require('axios')

module.exports.axiosDefaults = function axiosDefaults() {
    axios.defaults.baseURL = 'https://fusion.preprod.zeta.in/api/v1/ifi/140793/';
    axios.defaults.headers.common['X-Zeta-AuthToken'] = 'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidGFnIjoieUVxcUtFMGpSS0NXTTVmSy1obmFFdyIsImFsZyI6IkExMjhHQ01LVyIsIml2IjoiQkJlcGtjV1RkeG5mOTJ6OSJ9.ks4o4q1qQQ3xg2bW_uQSxOKDDM4LzwCsExFV6b93Cs0.nJUXFlbLyzuhedB299dJsA.AenCHJ2hU2G0KS7FkH2an1i-dZtIFagubCy4KJDw-ybRjaQtjgY4N59yeJlkEK8lFgOxWvN1bxjSAS6fUfODX8iapa9R1icKbVUdf-OJP4V0wTAqVxTa3puJYFipN5nM1imnEpEMwjvgPNEvNsBZNwAjyq5m4JI7cBq0EjZ44ZBuSOtCTH28hwFZJhHeDxLdhk98tlzxoaehHRfN385sjmhAoIQNxjoioQQs71q2N6CZ08O3YU4JxpqnGqwZ4LgQohN89SISTEQXSB_G38vn1p1Du01ZxQAq6FRheNMZ8NQmvI5zmFcI3BOeM5aVDSASpqwLHRp8dmk1EIGX7bB5UgAoOjDj-1nl3nCiV7sMDAUnPyF4Jt8zHJ4HnsbgBCMDWuA-HkqVsVurFtugMFTNYw.R_HvCdDfZKXznI-AgMsqsw';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    return axios
}
