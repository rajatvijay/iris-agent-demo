import React, { useMemo, useState } from "react";
import { Select, Table } from "antd";
import { useIncidentsData } from "../dataHooks/useIncidents";

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
    <div>
      <Filters
        onFilterChanged={handleFilterChange}
        incidentSources={incidentSources}
      />
      <Table
        loading={status === "loading"}
        dataSource={filteredIncidents}
        pagination={false}
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
  return (
    <div style={{ display: "flex" }}>
      <span>Filters: </span>
      <Select
        style={{ width: 200 }}
        mode="multiple"
        onChange={(selection) => {
          console.log(selection);
          onFilterChanged("source", selection);
        }}
      >
        {incidentSources.map((source) => (
          <Select.Option value={source}>{source}</Select.Option>
        ))}
      </Select>
    </div>
  );
};

export { Incidents };
