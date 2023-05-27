(function() {
    
    // MARK: - Router
    
    queryById("fromMoreToMain").onclick = function() {
        showScreen("mainScreen");
    }
    
    
    // MARK: - Actions
    
    // Click on row with select
    
    const itemsWithSelect = querySelectorAll("#moreScreen .popUpMenuList:has(select)");
    
    for (const index in itemsWithSelect) {
        const item = itemsWithSelect[index];
        item.onclick = function() {
            showDropdown(item.querySelector("select"));
        }
    }
    
    
})();


