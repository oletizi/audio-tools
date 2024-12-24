import {Box, Switch} from "@mui/material";

export function DoubleThrowSwitch({color = "#777", aLabel, bLabel, onChange = () => void 0}: {
    color?: string, aLabel: string, bLabel: string, onChange?: (v: number) => void
}) {
    return (
        <div className="flex justify-center content-center items-center" style={{color: color}}>
            <div>{aLabel}</div>
            <Switch onChange={(e) => {
                onChange(e.target.checked ? 1 : 0)
            }}/>
            <div>{bLabel}</div>
        </div>)
}

export function LabeledBorder({
                                  border = 2,
                                  borderRadius = 1,
                                  label = "",
                                  textColor = "#999",
                                  color = "#ddd",
                                  children
                              }) {
    return (
        <Box
            border={border}
            borderColor={color}
            borderRadius={borderRadius}
            p={2}
            position="relative"
        >
            <Box
                position="absolute"
                top={-14}
                left={10}
                bgcolor="white"
                px={1}
            >
                <span style={{color: textColor}}>{label}</span>
            </Box>
            {children}
        </Box>
    )
}