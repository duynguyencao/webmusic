// Hàm fetchModel để lấy dữ liệu từ backend (chỉ GET)
export async function fetchModel(model, params = {}) {
    let url = '';
    switch (model) {
        case 'songs':
            url = 'http://localhost:5000/api/song';
            break;
        case 'users':
            url = 'http://localhost:5000/api/user';
            break;
        default:
            throw new Error('Unknown model: ' + model);
    }

    if (Object.keys(params).length > 0) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
}