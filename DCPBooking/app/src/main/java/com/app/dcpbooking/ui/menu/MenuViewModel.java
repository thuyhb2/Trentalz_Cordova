package com.app.dcpbooking.ui.menu;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import java.util.ArrayList;
import java.util.List;

public class MenuViewModel extends ViewModel {

    private MutableLiveData<List<String>> _menus;

    public LiveData<List<String>> getMenuList() {
        if (_menus == null) {
            List<String> list=new ArrayList<String>();
            list.add("Căn hộ");
            list.add("Nhà ở");
            _menus = new MutableLiveData<List<String>>();
            _menus.setValue(list);
        }
        return _menus;
    }
}