package com.app.dcpbooking.ui.home;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.navigation.Navigator;

import com.app.dcpbooking.R;
import com.app.dcpbooking.databinding.FragmentHomeBinding;
import com.app.dcpbooking.utils.DatePickerFragment;

public class HomeFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private FragmentHomeBinding binding;

    private final String[] type = {"Option","Apartment","Hotel","Motel"};
    private final String[] number_room = {"Option", "1 bedroom", "2 bedroom","3 bedroom"};
    private final String[] furniture = {"Full Interior", "No Furniture"};

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        homeViewModel =
                new ViewModelProvider(this).get(HomeViewModel.class);

        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        handleView();
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private void handleView() {
        final EditText edtFromDate = binding.edtDate;
        onClickDrawable(edtFromDate, view -> showTimePickerDialog(edtFromDate));

        initSpinner(binding.spinnerType, type);
        initSpinner(binding.spinnerTypeRoom, number_room);
        initSpinner(binding.spinnerFurniture, furniture);

        binding.btnSearch.setOnClickListener(view -> {

            boolean isCheck = checkValidate();
            if (!isCheck) {
                Toast.makeText(getContext(), "There is an empty data field", Toast.LENGTH_SHORT).show();
            } else {
                Navigation.findNavController(view).navigate(
                        R.id.action_nav_home_to_bookingFragment);
            }
        });
    }

    @SuppressLint("ClickableViewAccessibility")
    private void onClickDrawable(EditText editText, View.OnClickListener onClickListener) {
        editText.setOnTouchListener((v, event) -> {
            final int DRAWABLE_RIGHT = 2;

            if (event.getAction() == MotionEvent.ACTION_UP) {
                if (event.getRawX() >= (editText.getRight() - editText.getCompoundDrawables()[DRAWABLE_RIGHT].getBounds().width())) {
                    onClickListener.onClick(v);
                    return true;
                }
            }
            return false;
        });
    }

    @SuppressLint("SetTextI18n")
    private void showTimePickerDialog(EditText editText) {
        DialogFragment newFragment = new DatePickerFragment((view, year, month, day) -> {
            editText.setText(day + "/" + month + "/" + year);
        });
        newFragment.show(getChildFragmentManager(), "timePicker");
    }

    private void initSpinner(Spinner spinner, String[] listData) {
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
//                Toast.makeText(getContext(),
//                        listData[i],
//                        Toast.LENGTH_LONG)
//                        .show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });

        ArrayAdapter adapter = new ArrayAdapter(getContext(), android.R.layout.simple_spinner_item, listData);
        adapter.setDropDownViewResource(
                android.R.layout
                        .simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
    }

    private boolean checkValidate() {
        if (binding.edtNameProperties.getText().toString().trim().isEmpty()) {
            return false;
        } else if (binding.edtAddress.getText().toString().trim().isEmpty()) {
            return false;
        } else if (binding.edtDate.getText().toString().trim().isEmpty()) {
            return false;
        } else return !binding.edtPrice.getText().toString().trim().isEmpty();
    }
}