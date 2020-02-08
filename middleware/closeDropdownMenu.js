export default ({ store }) => {
    if (store.getters.isDropdownMenuOpen) {
        store.dispatch('setIsDropdownMenuOpen', false)
    }
}