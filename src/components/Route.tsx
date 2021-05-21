function Route({path, children}: {path: any, children: any}) {
    return window.location.pathname === path ? children : null
}

export default Route;
