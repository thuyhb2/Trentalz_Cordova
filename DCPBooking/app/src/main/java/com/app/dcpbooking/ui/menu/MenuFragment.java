package com.app.dcpbooking.ui.menu;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;

import com.app.dcpbooking.databinding.MenuFragmentBinding;
import java.util.List;

public class MenuFragment extends Fragment {

    private MenuViewModel mViewModel;
    private MenuFragmentBinding binding;

    public static MenuFragment newInstance() {
        return new MenuFragment();
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        mViewModel =
                new ViewModelProvider(this).get(MenuViewModel.class);
        binding = MenuFragmentBinding.inflate(inflater, container, false);
        View root = binding.getRoot();
        final LinearLayout _view = binding.navMenu;

        mViewModel.getMenuList().observe(getViewLifecycleOwner(), new Observer<List<String>>() {
            @Override
            public void onChanged(List<String> strings) {
                buildMenu(strings, _view);
            }
        });

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private void buildMenu(List<String> mTexts, LinearLayout _view) {
        for(String txt:mTexts) {
                Button btn = new Button(getActivity());
                btn.setText(txt);
                _view.addView(btn);
            }
    }

}