import React from "react";
import './staff_components.css';
import searchIcon from "../../../components/assets/images/search_icon.png";

const JobHeader = (props) => {
  return (
    <div className="row m-0 mb-4">
      <div className="col-6 p-0 job_filter_background d-flex align-items-center">
        <div className="row m-0 align-items-center">
          {!props.hideSearchSelect && <div className="col-4 p-0 ps-4">
            <select className="job_drodown position-relative" name="option" onChange={(e) => props.setSearchFilter && props.setSearchFilter(e.target.value)}>
              {!props.hideMedicalSetting && <option value="medicalSettings" selected> Medical Settings</option>}
              <option value="jobTitle"> Job title</option>
              {!props.hideLocation && <option value="location"> Location</option>}
              {!props.hideHospitalName && <option value="hospitalName">
                {" "}
                Hospital Name
              </option>}

            </select>
          </div>}
          <div className={`${props.searchText ? "col-12" : "col-8"} p-0 d-flex align-items-center`}>
            <img src={searchIcon} alt="badge.png" className="tick_icon ps-3" width="30" />
            <input placeholder={props.searchText ? props.searchText : "Search"} type="text" className="search_input" value={props.search && props.search} onChange={(e) => props.setSearch && props.setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {!props.hideSortSelect && <React.Fragment>
        {props.sortingOptions ? <div className="col-3 px-4">
          <div className="job_filter_background px-4">
            <select className="job_drodown position-relative" value={props.sortingValue && props.sortingValue} name="option" onChange={(e) => props.setSorting && props.setSorting(e.target.value)}>
              <option value="" disabled selected hidden>
                {" "}
                Sorting
              </option>
              {props.sortingOptions.map((v, i) => {
                return <option key={i} value={v.value}>{v.label}</option>
              })}
            </select>
          </div>
        </div> : <div className="col-3 px-4">
          <div className="job_filter_background px-4">
            <select className="job_drodown position-relative" value={props.sortingValue && props.sortingValue} name="option" onChange={(e) => props.setSorting && props.setSorting(e.target.value)}>
              <option value="" disabled selected hidden>
                {" "}
                Sorting
              </option>
              <option value="availability">Availability</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>}

      </React.Fragment>}



      {!props.hideFilterSelect && <React.Fragment>
        {props.filterOptions ? <div className="col-md-3 col-sm-12 col-12 top_F" style={{ backgroundColor: '#fff' }}>
          <div className="row">
            <div className="col-md-1 col-sm-1 col-1">
              <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1L1 6L11 11L21 6L11 1Z" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1 16L11 21L21 16" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1 10.9999L11 15.9999L21 10.9999" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div className="col-md-10 pe-0 col-sm-10 col-10">
              <select className="form-select selectsorting mt-2" value={props.filterValue && props.filterValue} arial-label="Default select example" onChange={(e) => props.setFilter && props.setFilter(e.target.value)}>
                <option value="" disabled selected hidden>
                  {" "}
                  Filter
                </option>
                {props.filterOptions.map((v, i) => {
                  return <option key={i} value={v.value}>{v.label}</option>
                })}
                { }
              </select>
            </div>
          </div>
        </div> :
          <div className="col-md-3 col-sm-12 col-12 top_F" style={{ backgroundColor: '#fff' }}>
            <div className="row">
              <div className="col-md-1 col-sm-1 col-1">
                <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 1L1 6L11 11L21 6L11 1Z" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M1 16L11 21L21 16" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M1 10.9999L11 15.9999L21 10.9999" stroke="#333333" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div className="col-md-10 pe-0 col-sm-10 col-10">
                <select className="form-select selectsorting mt-2" value={props.filterValue && props.filterValue} arial-label="Default select example" onChange={(e) => props.setFilter && props.setFilter(e.target.value)}>
                  <option value="" disabled selected hidden>
                    {" "}
                    Filter
                  </option>
                  <option value="medicalSettings"> Medical Setting</option>
                  <option value="weekendAvailiblity"> Weekend Availability</option>
                  <option value="Commitment"> Commitment</option>
                </select>
              </div>
            </div>
          </div>}

      </React.Fragment>
      }
    </div>
  );
};

export default JobHeader;