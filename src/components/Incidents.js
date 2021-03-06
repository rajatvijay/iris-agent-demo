import React, { useMemo, useState } from "react";
import { Select, Table, DatePicker } from "antd";
import { useIncidentsData } from "../dataHooks/useIncidents";
import moment from "moment";
import { FilterLayout } from "./FilterLayout";

const { RangePicker } = DatePicker;

const Incidents = (props) => {
  const { status, incidents, error } = useIncidentsData();
  const [filters, setFilters] = useState({});

  const handleFilterChange = (name, value) => {
    setFilters((filters) => {
      return {
        ...filters,
        [name]: value,
      };
    });
  };

  const incidentSources = useMemo(() => {
    return Array.from(
      new Set(incidents?.map((incident) => incident.source) || [])
    );
  }, [incidents]);

  const filteredIncidents =
    incidents?.filter((incident) => {
      return Object.keys(filters).every((name) => {
        if (name === "source") {
          const value = filters[name];
          return value.length ? value.includes(incident.source) : true;
        } else if (name === "createdAt") {
          const value = filters[name];
          const incidentTimestamp = +moment(incident.createdAt);

          // When the filter is not selected
          if (!value || !value.length) {
            return incident;
          }

          const [startTime, endTime] = value;
          // console.log(name, value, incidentTimestamp, +startTime, +endTime);
          return (
            incidentTimestamp >= +startTime && incidentTimestamp <= +endTime
          );
        } else {
          // TODO: More filters
          return false;
        }
      });
    }) || incidents;

  if (status === "error") {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Filters
        onFilterChanged={handleFilterChange}
        incidentSources={incidentSources}
      />
      <Table
        loading={status === "loading"}
        dataSource={filteredIncidents}
        pagination={{
          pageSize: 4,
          total: filteredIncidents.length,
        }}
        columns={[
          {
            title: "Type",
            dataIndex: "source",
            key: "source",
            render: (value) => {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "red",
                      marginRight: 10,
                    }}
                  ></div>
                  <span>{value}</span>
                </div>
              );
            },
          },
          {
            title: "Incident Name",
            dataIndex: "title",
            key: "title",
          },
          {
            title: "ID Number",
            dataIndex: "incidentId",
            key: "incidentId",
          },
          {
            title: "Date Created",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value) => {
              // TODO: use date-fns
              return value;
            },
          },
          {
            title: "Support Cases",
            dataIndex: "cases",
            key: "cases",
          },
        ]}
      />
    </div>
  );
};

// TODO: Move it into a diff file later
const Filters = (props) => {
  const { onFilterChanged, incidentSources } = props;
  const handleDateChange = (dates) => {
    onFilterChanged("createdAt", dates);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      <span style={{ marginRight: 10 }}>Filters: </span>
      <FilterLayout label="Source">
        <Select
          style={{ width: 200 }}
          mode="multiple"
          placeholder="Select Type"
          onChange={(selection) => {
            console.log(selection);
            onFilterChanged("source", selection);
          }}
        >
          {incidentSources.map((source) => (
            <Select.Option value={source}>{source}</Select.Option>
          ))}
        </Select>
      </FilterLayout>
      <FilterLayout label="Created At">
        <RangePicker onChange={handleDateChange} />
      </FilterLayout>
    </div>
  );
};

export { Incidents };
