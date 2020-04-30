-- CONFIG
-------------------------------------------
-- CAD URl
local cadURL = 'localhost' -- No slash at the end
-------------------------------------------



-- CODE 
-------------------------------------------

-- Register chatmessage
RegisterServerEvent("chatMessage")

RegisterCommand("calltow", function(source)
    CancelEvent()
    local name = GetPlayerName(source)
    TriggerClientEvent("towCall", source, name)
end)

-- register the updater
RegisterServerEvent("towCallUpdate")

-- POST the call to the CAD
AddEventHandler("towCallUpdate", function(street, name)
    PerformHttpRequest(cadURL .. '/create-tow-call',
                       function(err, text, headers) end, 'POST',
                       json.encode({name = name, location = street}),
                       {["Content-Type"] = 'application/json'})

    CancelEvent()
end)

-- CODE
-------------------------------------------